"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminSession,
  destroyAdminSession,
  hasAnyAdmin,
  requireAdmin,
} from "@/lib/auth";
import {
  createInventoryItemRecord,
  createAppointmentRecord,
  createIntake,
  createMedicalEventRecord,
  createOwnerRecord,
  createOwnerAndPet,
  createTreatmentPlanRecord,
  deleteInventoryItemRecord,
  deleteIntakeById,
  deleteOwnerRecord,
  deletePetRecord,
  finishCheckInRecord,
  startCheckInRecord,
  toCents,
  updateAppointmentStatusRecord,
  updateInventoryItemRecord,
  updateIntake,
  updateOwnerRecord,
  updatePetRecord,
} from "@/lib/clinic-service";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { createResetToken, hashPassword, hashToken, verifyPassword } from "@/lib/security";

function text(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);

  return value.length > 0 ? value : null;
}

function optionalDate(formData: FormData, key: string) {
  const value = text(formData, key);

  return value ? new Date(value) : null;
}

function requiredDate(formData: FormData, key: string) {
  const value = text(formData, key);

  if (!value) {
    throw new Error(`Câmpul ${key} este obligatoriu.`);
  }

  return new Date(value);
}

function numberOrNull(formData: FormData, key: string) {
  const value = text(formData, key).replace(",", ".");

  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function centsOrZero(formData: FormData, key: string) {
  return toCents(numberOrNull(formData, key));
}

function booleanValue(formData: FormData, key: string) {
  return Boolean(formData.get(key));
}

function requireValue(value: string, label: string) {
  if (!value) {
    throw new Error(`${label} este obligatoriu.`);
  }

  return value;
}

export async function registerFirstAdmin(formData: FormData) {
  if (await hasAnyAdmin()) {
    redirect("/admin/login?error=bootstrap-complete");
  }

  const name = requireValue(text(formData, "name"), "Numele");
  const email = requireValue(text(formData, "email").toLowerCase(), "Emailul");
  const password = requireValue(text(formData, "password"), "Parola");

  if (password.length < 10) {
    redirect("/admin/register?error=password");
  }

  const admin = await prisma.adminUser.create({
    data: {
      name,
      email,
      role: "OWNER",
      passwordHash: hashPassword(password),
    },
  });

  await createAdminSession(admin.id);
  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "AdminUser",
    entityId: admin.id,
    summary: `A fost creat primul admin ${admin.email}.`,
  });
  redirect("/admin");
}

export async function loginAdmin(formData: FormData) {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin || !admin.active || !verifyPassword(password, admin.passwordHash)) {
    redirect("/admin/login?error=credentials");
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });
  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function requestPasswordReset(formData: FormData) {
  const email = text(formData, "email").toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin || !admin.active) {
    redirect("/admin/forgot-password?sent=1");
  }

  const { token, tokenHash } = createResetToken();

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: admin.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const devToken =
    process.env.NODE_ENV === "production" ? "" : `&devToken=${token}`;

  redirect(`/admin/forgot-password?sent=1${devToken}`);
}

export async function resetPassword(formData: FormData) {
  const token = text(formData, "token");
  const password = text(formData, "password");

  if (password.length < 10) {
    redirect(`/admin/reset-password?token=${token}&error=password`);
  }

  const tokenHash = hashToken(token);
  const reset = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!reset) {
    redirect("/admin/reset-password?error=token");
  }

  await prisma.$transaction([
    prisma.adminUser.update({
      where: { id: reset.userId },
      data: { passwordHash: hashPassword(password) },
    }),
    prisma.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    }),
    prisma.adminSession.deleteMany({ where: { userId: reset.userId } }),
  ]);

  redirect("/admin/login?reset=1");
}

export async function createAdminUser(formData: FormData) {
  const admin = await requireAdmin();

  const name = requireValue(text(formData, "name"), "Numele");
  const email = requireValue(text(formData, "email").toLowerCase(), "Emailul");
  const password = requireValue(text(formData, "password"), "Parola");

  const created = await prisma.adminUser.create({
    data: {
      name,
      email,
      role: text(formData, "role") || "ADMIN",
      passwordHash: hashPassword(password),
    },
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "AdminUser",
    entityId: created.id,
    summary: `A fost creat adminul ${created.email}.`,
  });

  revalidatePath("/admin/setari");
}

export async function createPublicIntake(formData: FormData) {
  await createIntake({
    ownerName: text(formData, "name"),
    ownerPhone: text(formData, "phone"),
    ownerEmail: optionalText(formData, "email"),
    petName: text(formData, "pet"),
    species: optionalText(formData, "species"),
    reason: text(formData, "message"),
    urgency: text(formData, "urgency") || "NORMAL",
    source: "WEBSITE",
  });

  redirect("/contact?sent=1#programare");
}

export async function updateIntakeStatus(formData: FormData) {
  const admin = await requireAdmin();

  const id = requireValue(text(formData, "id"), "ID formular");
  const status = requireValue(text(formData, "status"), "Status");
  const response = optionalText(formData, "response");

  await updateIntake({
    id,
    status,
    response,
    triageNotes: optionalText(formData, "triageNotes"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "UPDATE",
    entityType: "IntakeSubmission",
    entityId: id,
    summary: `Status formular actualizat la ${status}.`,
  });

  revalidatePath("/admin/formulare");
}

export async function deleteIntake(formData: FormData) {
  const admin = await requireAdmin();
  const id = text(formData, "id");

  await deleteIntakeById(id);

  await writeAuditLog({
    actorId: admin.id,
    action: "DELETE",
    entityType: "IntakeSubmission",
    entityId: id,
    summary: "Formular șters.",
  });

  revalidatePath("/admin/formulare");
}

export async function createOwnerWithPet(formData: FormData) {
  const admin = await requireAdmin();

  const owner = await createOwnerAndPet({
    firstName: text(formData, "firstName"),
    lastName: text(formData, "lastName"),
    phone: text(formData, "phone"),
    email: optionalText(formData, "email"),
    address: optionalText(formData, "address"),
    city: optionalText(formData, "city"),
    county: optionalText(formData, "county"),
    preferredContact: text(formData, "preferredContact") || "PHONE",
    gdprConsentAt: formData.get("gdprConsent") ? new Date() : null,
    marketingConsent: Boolean(formData.get("marketingConsent")),
    emergencyContactName: optionalText(formData, "emergencyContactName"),
    emergencyContactPhone: optionalText(formData, "emergencyContactPhone"),
    ownerNotes: optionalText(formData, "ownerNotes"),
    petName: text(formData, "petName"),
    species: text(formData, "species"),
    breed: optionalText(formData, "breed"),
    sex: optionalText(formData, "sex"),
    birthDate: optionalDate(formData, "birthDate"),
    color: optionalText(formData, "color"),
    microchipNumber: optionalText(formData, "microchipNumber"),
    reproductiveStatus: optionalText(formData, "reproductiveStatus"),
    weightKg: numberOrNull(formData, "weightKg"),
    allergies: optionalText(formData, "allergies"),
    chronicConditions: optionalText(formData, "chronicConditions"),
    diet: optionalText(formData, "diet"),
    insuranceProvider: optionalText(formData, "insuranceProvider"),
    petNotes: optionalText(formData, "petNotes"),
  });

  const petId = owner.pets[0]?.id;

  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "Owner",
    entityId: owner.id,
    summary: `Proprietar creat: ${owner.firstName} ${owner.lastName}.`,
    metadata: { petId },
  });

  redirect(petId ? `/admin/pacienti/${petId}` : "/admin/pacienti");
}

export async function createOwner(formData: FormData) {
  const admin = await requireAdmin();
  const owner = await createOwnerRecord({
    firstName: text(formData, "firstName"),
    lastName: text(formData, "lastName"),
    phone: text(formData, "phone"),
    email: optionalText(formData, "email"),
    address: optionalText(formData, "address"),
    city: optionalText(formData, "city"),
    county: optionalText(formData, "county"),
    preferredContact: text(formData, "preferredContact") || "PHONE",
    gdprConsentAt: formData.get("gdprConsent") ? new Date() : null,
    marketingConsent: booleanValue(formData, "marketingConsent"),
    emergencyContactName: optionalText(formData, "emergencyContactName"),
    emergencyContactPhone: optionalText(formData, "emergencyContactPhone"),
    notes: optionalText(formData, "notes"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "Owner",
    entityId: owner.id,
    summary: `Proprietar creat: ${owner.firstName} ${owner.lastName}.`,
  });

  redirect(`/admin/proprietari/${owner.id}`);
}

export async function updateOwner(formData: FormData) {
  const admin = await requireAdmin();
  const id = requireValue(text(formData, "id"), "ID proprietar");
  const owner = await updateOwnerRecord({
    id,
    firstName: text(formData, "firstName"),
    lastName: text(formData, "lastName"),
    phone: text(formData, "phone"),
    email: optionalText(formData, "email"),
    address: optionalText(formData, "address"),
    city: optionalText(formData, "city"),
    county: optionalText(formData, "county"),
    preferredContact: text(formData, "preferredContact") || "PHONE",
    gdprConsentAt: formData.get("gdprConsent") ? new Date() : null,
    marketingConsent: booleanValue(formData, "marketingConsent"),
    emergencyContactName: optionalText(formData, "emergencyContactName"),
    emergencyContactPhone: optionalText(formData, "emergencyContactPhone"),
    notes: optionalText(formData, "notes"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "UPDATE",
    entityType: "Owner",
    entityId: owner.id,
    summary: `Proprietar actualizat: ${owner.firstName} ${owner.lastName}.`,
  });

  revalidatePath(`/admin/proprietari/${id}`);
  revalidatePath("/admin/proprietari");
}

export async function deleteOwner(formData: FormData) {
  const admin = await requireAdmin();
  const id = requireValue(text(formData, "id"), "ID proprietar");
  const ownerName = text(formData, "ownerName");

  await deleteOwnerRecord(id);

  await writeAuditLog({
    actorId: admin.id,
    action: "DELETE",
    entityType: "Owner",
    entityId: id,
    summary: `Proprietar șters: ${ownerName || id}.`,
  });

  redirect("/admin/proprietari");
}

export async function updatePet(formData: FormData) {
  const admin = await requireAdmin();
  const id = requireValue(text(formData, "id"), "ID pacient");
  const pet = await updatePetRecord({
    id,
    ownerId: text(formData, "ownerId") || undefined,
    name: text(formData, "name"),
    species: text(formData, "species"),
    breed: optionalText(formData, "breed"),
    sex: optionalText(formData, "sex"),
    birthDate: optionalDate(formData, "birthDate"),
    color: optionalText(formData, "color"),
    microchipNumber: optionalText(formData, "microchipNumber"),
    reproductiveStatus: optionalText(formData, "reproductiveStatus"),
    weightKg: numberOrNull(formData, "weightKg"),
    allergies: optionalText(formData, "allergies"),
    chronicConditions: optionalText(formData, "chronicConditions"),
    diet: optionalText(formData, "diet"),
    insuranceProvider: optionalText(formData, "insuranceProvider"),
    notes: optionalText(formData, "notes"),
    active: booleanValue(formData, "active"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "UPDATE",
    entityType: "Pet",
    entityId: pet.id,
    summary: `Pacient actualizat: ${pet.name}.`,
  });

  revalidatePath(`/admin/pacienti/${id}`);
  revalidatePath("/admin/pacienti");
}

export async function deletePet(formData: FormData) {
  const admin = await requireAdmin();
  const id = requireValue(text(formData, "id"), "ID pacient");
  const petName = text(formData, "petName");

  await deletePetRecord(id);

  await writeAuditLog({
    actorId: admin.id,
    action: "DELETE",
    entityType: "Pet",
    entityId: id,
    summary: `Pacient șters: ${petName || id}.`,
  });

  redirect("/admin/pacienti");
}

export async function createMedicalEvent(formData: FormData) {
  const admin = await requireAdmin();
  const petId = requireValue(text(formData, "petId"), "Pacientul");

  await createMedicalEventRecord({
    petId,
    type: text(formData, "type") || "CONSULTATIE",
    title: text(formData, "title"),
    occurredAt: optionalDate(formData, "occurredAt") ?? new Date(),
    summary: optionalText(formData, "summary"),
    diagnosis: optionalText(formData, "diagnosis"),
    treatment: optionalText(formData, "treatment"),
    recommendations: optionalText(formData, "recommendations"),
    followUpAt: optionalDate(formData, "followUpAt"),
    costCents: centsOrZero(formData, "cost"),
    createdById: admin.id,
    staffMemberId: optionalText(formData, "staffMemberId"),
    subjective: optionalText(formData, "subjective"),
    objective: optionalText(formData, "objective"),
    assessment: optionalText(formData, "assessment"),
    plan: optionalText(formData, "plan"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "MedicalEvent",
    entityId: petId,
    summary: `Eveniment medical creat pentru pacient.`,
    metadata: { title: text(formData, "title"), type: text(formData, "type") },
  });

  revalidatePath(`/admin/pacienti/${petId}`);
}

export async function createAppointment(formData: FormData) {
  const admin = await requireAdmin();
  const startAt = requiredDate(formData, "startAt");
  const duration = Number(text(formData, "durationMinutes") || "30");
  const petId = optionalText(formData, "petId");
  const ownerId = optionalText(formData, "ownerId");

  await createAppointmentRecord({
    petId,
    ownerId,
    staffMemberId: optionalText(formData, "staffMemberId"),
    roomId: optionalText(formData, "roomId"),
    appointmentTypeId: optionalText(formData, "appointmentTypeId"),
    startAt,
    durationMinutes: duration,
    reason: text(formData, "reason"),
    notes: optionalText(formData, "notes"),
    status: text(formData, "status") || "PROGRAMATA",
    createdById: admin.id,
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "Appointment",
    summary: `Programare creată: ${text(formData, "reason")}.`,
    metadata: { petId, ownerId, startAt },
  });

  revalidatePath("/admin/calendar");
  revalidatePath("/admin/check-in");
}

export async function updateAppointmentStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");

  await updateAppointmentStatusRecord(
    id,
    status,
    optionalText(formData, "cancellationReason"),
  );

  await writeAuditLog({
    actorId: admin.id,
    action: "UPDATE",
    entityType: "Appointment",
    entityId: id,
    summary: `Status programare actualizat la ${status}.`,
  });

  revalidatePath("/admin/calendar");
  revalidatePath("/admin/check-in");
}

export async function startCheckIn(formData: FormData) {
  const admin = await requireAdmin();

  const checkIn = await startCheckInRecord({
    appointmentId: text(formData, "appointmentId"),
    presentingComplaint: optionalText(formData, "presentingComplaint"),
    estimatedCostCents: centsOrZero(formData, "estimatedCost"),
    consentSigned: Boolean(formData.get("consentSigned")),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "CheckIn",
    entityId: checkIn.id,
    summary: "Check-in început.",
  });

  revalidatePath("/admin/check-in");
  revalidatePath("/admin/calendar");
}

export async function finishCheckIn(formData: FormData) {
  const admin = await requireAdmin();

  const checkIn = await finishCheckInRecord({
    id: text(formData, "id"),
    dischargeNotes: optionalText(formData, "dischargeNotes"),
    paymentStatus: text(formData, "paymentStatus") || "NEPLATIT",
    paidCents: centsOrZero(formData, "paid"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "UPDATE",
    entityType: "CheckIn",
    entityId: checkIn.id,
    summary: "Check-out finalizat.",
  });

  revalidatePath("/admin/check-in");
  revalidatePath("/admin/calendar");
}

export async function createTreatmentPlan(formData: FormData) {
  const admin = await requireAdmin();

  const petId = requireValue(text(formData, "petId"), "Pacientul");
  const plan = await createTreatmentPlanRecord({
    petId,
    ownerId: optionalText(formData, "ownerId"),
    appointmentId: optionalText(formData, "appointmentId"),
    title: text(formData, "title"),
    status: text(formData, "status") || "DRAFT",
    diagnosis: optionalText(formData, "diagnosis"),
    totalEstimatedCents: centsOrZero(formData, "totalEstimated"),
    approvedByName: optionalText(formData, "approvedByName"),
    notes: optionalText(formData, "notes"),
    itemKind: text(formData, "itemKind") || "SERVICIU",
    itemName: text(formData, "itemName"),
    dosage: optionalText(formData, "dosage"),
    frequency: optionalText(formData, "frequency"),
    duration: optionalText(formData, "duration"),
    quantity: numberOrNull(formData, "quantity"),
    unit: optionalText(formData, "unit"),
    itemCostCents: centsOrZero(formData, "itemCost"),
    instructions: optionalText(formData, "instructions"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "TreatmentPlan",
    entityId: plan.id,
    summary: `Plan de tratament creat: ${plan.title}.`,
  });

  revalidatePath("/admin/planuri");
  revalidatePath(`/admin/pacienti/${petId}`);
}

export async function createInventoryItem(formData: FormData) {
  const admin = await requireAdmin();
  const item = await createInventoryItemRecord({
    name: text(formData, "name"),
    category: text(formData, "category") || "MEDICAMENT",
    sku: optionalText(formData, "sku"),
    batchNumber: optionalText(formData, "batchNumber"),
    manufacturer: optionalText(formData, "manufacturer"),
    supplier: optionalText(formData, "supplier"),
    quantity: numberOrNull(formData, "quantity") ?? 0,
    unit: text(formData, "unit") || "buc",
    minQuantity: numberOrNull(formData, "minQuantity") ?? 0,
    expiresAt: optionalDate(formData, "expiresAt"),
    storageLocation: optionalText(formData, "storageLocation"),
    status: text(formData, "status") || "ACTIV",
    notes: optionalText(formData, "notes"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "CREATE",
    entityType: "InventoryItem",
    entityId: item.id,
    summary: `Produs inventar creat: ${item.name}.`,
  });

  revalidatePath("/admin/inventar");
}

export async function updateInventoryItem(formData: FormData) {
  const admin = await requireAdmin();
  const item = await updateInventoryItemRecord({
    id: text(formData, "id"),
    name: text(formData, "name"),
    category: text(formData, "category") || "MEDICAMENT",
    sku: optionalText(formData, "sku"),
    batchNumber: optionalText(formData, "batchNumber"),
    manufacturer: optionalText(formData, "manufacturer"),
    supplier: optionalText(formData, "supplier"),
    quantity: numberOrNull(formData, "quantity") ?? 0,
    unit: text(formData, "unit") || "buc",
    minQuantity: numberOrNull(formData, "minQuantity") ?? 0,
    expiresAt: optionalDate(formData, "expiresAt"),
    storageLocation: optionalText(formData, "storageLocation"),
    status: text(formData, "status") || "ACTIV",
    notes: optionalText(formData, "notes"),
  });

  await writeAuditLog({
    actorId: admin.id,
    action: "UPDATE",
    entityType: "InventoryItem",
    entityId: item.id,
    summary: `Produs inventar actualizat: ${item.name}.`,
  });

  revalidatePath("/admin/inventar");
}

export async function deleteInventoryItem(formData: FormData) {
  const admin = await requireAdmin();
  const id = text(formData, "id");
  const itemName = text(formData, "name");

  await deleteInventoryItemRecord(id);

  await writeAuditLog({
    actorId: admin.id,
    action: "DELETE",
    entityType: "InventoryItem",
    entityId: id,
    summary: `Produs inventar șters: ${itemName || id}.`,
  });

  revalidatePath("/admin/inventar");
}

export async function createStaffMember(formData: FormData) {
  await requireAdmin();

  await prisma.staffMember.create({
    data: {
      name: requireValue(text(formData, "name"), "Numele"),
      role: text(formData, "role") || "MEDIC",
      email: optionalText(formData, "email"),
      phone: optionalText(formData, "phone"),
      color: text(formData, "color") || "#5FC9A8",
    },
  });

  revalidatePath("/admin/setari");
}

export async function createRoom(formData: FormData) {
  await requireAdmin();

  await prisma.room.create({
    data: {
      name: requireValue(text(formData, "name"), "Numele"),
      type: text(formData, "type") || "CABINET",
    },
  });

  revalidatePath("/admin/setari");
}

export async function createAppointmentType(formData: FormData) {
  await requireAdmin();

  await prisma.appointmentType.create({
    data: {
      name: requireValue(text(formData, "name"), "Numele"),
      durationMinutes: Number(text(formData, "durationMinutes") || "30"),
      color: text(formData, "color") || "#BBD7F0",
    },
  });

  revalidatePath("/admin/setari");
}
