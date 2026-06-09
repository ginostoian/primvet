import { prisma } from "@/lib/db";
import { isAppointmentStatus } from "@/lib/appointment-status";

type NullableDate = Date | null;
type NullableString = string | null;

export type IntakeInput = {
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: NullableString;
  petName: string;
  species?: NullableString;
  reason: string;
  urgency?: string;
  source?: string;
};

export type IntakeUpdateInput = {
  id: string;
  status: string;
  response?: NullableString;
  triageNotes?: NullableString;
  now?: Date;
};

export type OwnerWithPetInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: NullableString;
  address?: NullableString;
  city?: NullableString;
  county?: NullableString;
  preferredContact?: string;
  gdprConsentAt?: NullableDate;
  marketingConsent?: boolean;
  emergencyContactName?: NullableString;
  emergencyContactPhone?: NullableString;
  ownerNotes?: NullableString;
  petName: string;
  species: string;
  breed?: NullableString;
  sex?: NullableString;
  birthDate?: NullableDate;
  color?: NullableString;
  microchipNumber?: NullableString;
  reproductiveStatus?: NullableString;
  weightKg?: number | null;
  allergies?: NullableString;
  chronicConditions?: NullableString;
  diet?: NullableString;
  insuranceProvider?: NullableString;
  petNotes?: NullableString;
};

export type OwnerUpdateInput = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: NullableString;
  address?: NullableString;
  city?: NullableString;
  county?: NullableString;
  preferredContact?: string;
  gdprConsentAt?: NullableDate;
  marketingConsent?: boolean;
  emergencyContactName?: NullableString;
  emergencyContactPhone?: NullableString;
  notes?: NullableString;
};

export type OwnerCreateInput = Omit<OwnerUpdateInput, "id">;

export type PetUpdateInput = {
  id: string;
  ownerId?: string;
  name: string;
  species: string;
  breed?: NullableString;
  sex?: NullableString;
  birthDate?: NullableDate;
  color?: NullableString;
  microchipNumber?: NullableString;
  reproductiveStatus?: NullableString;
  weightKg?: number | null;
  allergies?: NullableString;
  chronicConditions?: NullableString;
  diet?: NullableString;
  insuranceProvider?: NullableString;
  notes?: NullableString;
  active?: boolean;
};

export type MedicalEventInput = {
  petId: string;
  createdById?: NullableString;
  staffMemberId?: NullableString;
  type?: string;
  title: string;
  occurredAt?: Date | null;
  summary?: NullableString;
  diagnosis?: NullableString;
  treatment?: NullableString;
  recommendations?: NullableString;
  followUpAt?: NullableDate;
  costCents?: number | null;
  subjective?: NullableString;
  objective?: NullableString;
  assessment?: NullableString;
  plan?: NullableString;
};

export type AppointmentInput = {
  ownerId?: NullableString;
  petId?: NullableString;
  staffMemberId?: NullableString;
  roomId?: NullableString;
  appointmentTypeId?: NullableString;
  createdById?: NullableString;
  startAt: Date;
  durationMinutes: number;
  reason: string;
  notes?: NullableString;
  status?: string;
};

export type StartCheckInInput = {
  appointmentId: string;
  presentingComplaint?: NullableString;
  estimatedCostCents?: number;
  consentSigned?: boolean;
  now?: Date;
};

export type FinishCheckInInput = {
  id: string;
  dischargeNotes?: NullableString;
  paymentStatus?: string;
  paidCents?: number;
  now?: Date;
};

export type TreatmentPlanInput = {
  ownerId?: NullableString;
  petId: string;
  appointmentId?: NullableString;
  title: string;
  status?: string;
  diagnosis?: NullableString;
  totalEstimatedCents?: number;
  approvedByName?: NullableString;
  notes?: NullableString;
  itemKind?: string;
  itemName: string;
  dosage?: NullableString;
  frequency?: NullableString;
  duration?: NullableString;
  quantity?: number | null;
  unit?: NullableString;
  itemCostCents?: number;
  instructions?: NullableString;
  now?: Date;
};

export type InventoryItemInput = {
  name: string;
  category?: string;
  sku?: NullableString;
  batchNumber?: NullableString;
  manufacturer?: NullableString;
  supplier?: NullableString;
  quantity?: number;
  unit?: string;
  minQuantity?: number;
  expiresAt?: NullableDate;
  storageLocation?: NullableString;
  status?: string;
  notes?: NullableString;
};

export type InventoryItemUpdateInput = InventoryItemInput & {
  id: string;
};

export function requireField(value: string, label: string) {
  if (!value) {
    throw new Error(`${label} este obligatoriu.`);
  }

  return value;
}

export function toCents(value: number | null | undefined) {
  return value ? Math.round(value * 100) : 0;
}

export async function createIntake(input: IntakeInput) {
  return prisma.intakeSubmission.create({
    data: {
      ownerName: requireField(input.ownerName, "Numele"),
      ownerPhone: requireField(input.ownerPhone, "Telefonul"),
      ownerEmail: input.ownerEmail ?? null,
      petName: requireField(input.petName, "Companionul"),
      species: input.species ?? null,
      reason: requireField(input.reason, "Motivul vizitei"),
      urgency: input.urgency || "NORMAL",
      source: input.source || "WEBSITE",
    },
  });
}

export async function updateIntake(input: IntakeUpdateInput) {
  const now = input.now ?? new Date();

  return prisma.intakeSubmission.update({
    where: { id: requireField(input.id, "ID formular") },
    data: {
      status: requireField(input.status, "Status"),
      response: input.response ?? null,
      triageNotes: input.triageNotes ?? null,
      respondedAt: input.status === "RASPUNS" ? now : undefined,
      archivedAt: input.status === "ARHIVAT" ? now : null,
    },
  });
}

export async function deleteIntakeById(id: string) {
  return prisma.intakeSubmission.delete({
    where: { id: requireField(id, "ID formular") },
  });
}

export async function createOwnerAndPet(input: OwnerWithPetInput) {
  return prisma.owner.create({
    data: {
      firstName: requireField(input.firstName, "Prenumele"),
      lastName: requireField(input.lastName, "Numele"),
      phone: requireField(input.phone, "Telefonul"),
      email: input.email ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      county: input.county ?? null,
      preferredContact: input.preferredContact || "PHONE",
      gdprConsentAt: input.gdprConsentAt ?? null,
      marketingConsent: input.marketingConsent ?? false,
      emergencyContactName: input.emergencyContactName ?? null,
      emergencyContactPhone: input.emergencyContactPhone ?? null,
      notes: input.ownerNotes ?? null,
      pets: {
        create: {
          name: requireField(input.petName, "Numele pacientului"),
          species: requireField(input.species, "Specia"),
          breed: input.breed ?? null,
          sex: input.sex ?? null,
          birthDate: input.birthDate ?? null,
          color: input.color ?? null,
          microchipNumber: input.microchipNumber ?? null,
          reproductiveStatus: input.reproductiveStatus ?? null,
          weightKg: input.weightKg ?? null,
          allergies: input.allergies ?? null,
          chronicConditions: input.chronicConditions ?? null,
          diet: input.diet ?? null,
          insuranceProvider: input.insuranceProvider ?? null,
          notes: input.petNotes ?? null,
        },
      },
    },
    include: { pets: true },
  });
}

export async function createOwnerRecord(input: OwnerCreateInput) {
  return prisma.owner.create({
    data: {
      firstName: requireField(input.firstName, "Prenumele"),
      lastName: requireField(input.lastName, "Numele"),
      phone: requireField(input.phone, "Telefonul"),
      email: input.email ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      county: input.county ?? null,
      preferredContact: input.preferredContact || "PHONE",
      gdprConsentAt: input.gdprConsentAt ?? null,
      marketingConsent: input.marketingConsent ?? false,
      emergencyContactName: input.emergencyContactName ?? null,
      emergencyContactPhone: input.emergencyContactPhone ?? null,
      notes: input.notes ?? null,
    },
  });
}

export async function updateOwnerRecord(input: OwnerUpdateInput) {
  return prisma.owner.update({
    where: { id: requireField(input.id, "ID proprietar") },
    data: {
      firstName: requireField(input.firstName, "Prenumele"),
      lastName: requireField(input.lastName, "Numele"),
      phone: requireField(input.phone, "Telefonul"),
      email: input.email ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      county: input.county ?? null,
      preferredContact: input.preferredContact || "PHONE",
      gdprConsentAt: input.gdprConsentAt ?? null,
      marketingConsent: input.marketingConsent ?? false,
      emergencyContactName: input.emergencyContactName ?? null,
      emergencyContactPhone: input.emergencyContactPhone ?? null,
      notes: input.notes ?? null,
    },
  });
}

export async function deleteOwnerRecord(id: string) {
  return prisma.owner.delete({
    where: { id: requireField(id, "ID proprietar") },
  });
}

export async function updatePetRecord(input: PetUpdateInput) {
  return prisma.pet.update({
    where: { id: requireField(input.id, "ID pacient") },
    data: {
      ownerId: input.ownerId,
      name: requireField(input.name, "Numele pacientului"),
      species: requireField(input.species, "Specia"),
      breed: input.breed ?? null,
      sex: input.sex ?? null,
      birthDate: input.birthDate ?? null,
      color: input.color ?? null,
      microchipNumber: input.microchipNumber ?? null,
      reproductiveStatus: input.reproductiveStatus ?? null,
      weightKg: input.weightKg ?? null,
      allergies: input.allergies ?? null,
      chronicConditions: input.chronicConditions ?? null,
      diet: input.diet ?? null,
      insuranceProvider: input.insuranceProvider ?? null,
      notes: input.notes ?? null,
      active: input.active ?? true,
    },
  });
}

export async function deletePetRecord(id: string) {
  return prisma.pet.delete({
    where: { id: requireField(id, "ID pacient") },
  });
}

export async function createMedicalEventRecord(input: MedicalEventInput) {
  return prisma.medicalEvent.create({
    data: {
      petId: requireField(input.petId, "Pacientul"),
      type: input.type || "CONSULTATIE",
      title: requireField(input.title, "Titlul"),
      occurredAt: input.occurredAt ?? new Date(),
      summary: input.summary ?? null,
      diagnosis: input.diagnosis ?? null,
      treatment: input.treatment ?? null,
      recommendations: input.recommendations ?? null,
      followUpAt: input.followUpAt ?? null,
      costCents: input.costCents ?? 0,
      createdById: input.createdById ?? null,
      staffMemberId: input.staffMemberId ?? null,
      soapNote: {
        create: {
          subjective: input.subjective ?? null,
          objective: input.objective ?? null,
          assessment: input.assessment ?? null,
          plan: input.plan ?? null,
          diagnosis: input.diagnosis ?? null,
          treatment: input.treatment ?? null,
          recommendations: input.recommendations ?? null,
          followUpAt: input.followUpAt ?? null,
        },
      },
    },
    include: { soapNote: true },
  });
}

export async function createAppointmentRecord(input: AppointmentInput) {
  const endAt = new Date(
    input.startAt.getTime() + input.durationMinutes * 60 * 1000,
  );

  return prisma.appointment.create({
    data: {
      petId: input.petId ?? null,
      ownerId: input.ownerId ?? null,
      staffMemberId: input.staffMemberId ?? null,
      roomId: input.roomId ?? null,
      appointmentTypeId: input.appointmentTypeId ?? null,
      startAt: input.startAt,
      endAt,
      reason: requireField(input.reason, "Motivul"),
      notes: input.notes ?? null,
      status: input.status || "PROGRAMATA",
      createdById: input.createdById ?? null,
    },
  });
}

export async function updateAppointmentStatusRecord(
  id: string,
  status: string,
  cancellationReason?: NullableString,
) {
  if (!isAppointmentStatus(status)) {
    throw new Error("Status programare invalid.");
  }

  return prisma.appointment.update({
    where: { id: requireField(id, "ID programare") },
    data: {
      status: requireField(status, "Status"),
      cancellationReason: cancellationReason ?? null,
    },
  });
}

export async function startCheckInRecord(input: StartCheckInInput) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: requireField(input.appointmentId, "Programarea") },
  });

  if (!appointment) {
    throw new Error("Programarea nu a fost găsită.");
  }

  const now = input.now ?? new Date();

  return prisma.$transaction(async (tx) => {
    await tx.appointment.update({
      where: { id: input.appointmentId },
      data: { status: "SOSIT", checkedInAt: now },
    });

    return tx.checkIn.upsert({
      where: { appointmentId: input.appointmentId },
      create: {
        appointmentId: input.appointmentId,
        ownerId: appointment.ownerId,
        petId: appointment.petId,
        visitReason: appointment.reason,
        presentingComplaint: input.presentingComplaint ?? null,
        estimatedCostCents: input.estimatedCostCents ?? 0,
        consentSignedAt: input.consentSigned ? now : null,
        status: "IN_CONSULT",
      },
      update: {
        presentingComplaint: input.presentingComplaint ?? null,
        estimatedCostCents: input.estimatedCostCents ?? 0,
        consentSignedAt: input.consentSigned ? now : null,
        status: "IN_CONSULT",
      },
    });
  });
}

export async function finishCheckInRecord(input: FinishCheckInInput) {
  const now = input.now ?? new Date();
  const checkIn = await prisma.checkIn.findUnique({ where: { id: input.id } });

  return prisma.$transaction(async (tx) => {
    const updatedCheckIn = await tx.checkIn.update({
      where: { id: requireField(input.id, "ID check-in") },
      data: {
        status: "FINALIZAT",
        checkedOutAt: now,
        dischargeNotes: input.dischargeNotes ?? null,
        paymentStatus: input.paymentStatus || "NEPLATIT",
        paidCents: input.paidCents ?? 0,
      },
    });

    if (checkIn?.appointmentId) {
      await tx.appointment.update({
        where: { id: checkIn.appointmentId },
        data: { status: "FINALIZATA", checkedOutAt: now },
      });
    }

    return updatedCheckIn;
  });
}

export async function createTreatmentPlanRecord(input: TreatmentPlanInput) {
  const status = input.status || "DRAFT";
  const now = input.now ?? new Date();

  return prisma.treatmentPlan.create({
    data: {
      petId: requireField(input.petId, "Pacientul"),
      ownerId: input.ownerId ?? null,
      appointmentId: input.appointmentId ?? null,
      title: requireField(input.title, "Titlul planului"),
      status,
      diagnosis: input.diagnosis ?? null,
      totalEstimatedCents: input.totalEstimatedCents ?? 0,
      approvedAt: status === "APROBAT" ? now : null,
      approvedByName: input.approvedByName ?? null,
      notes: input.notes ?? null,
      items: {
        create: {
          stepOrder: 1,
          kind: input.itemKind || "SERVICIU",
          name: requireField(input.itemName, "Primul pas"),
          dosage: input.dosage ?? null,
          frequency: input.frequency ?? null,
          duration: input.duration ?? null,
          quantity: input.quantity ?? null,
          unit: input.unit ?? null,
          estimatedCostCents: input.itemCostCents ?? 0,
          instructions: input.instructions ?? null,
        },
      },
    },
    include: { items: true },
  });
}

export async function createInventoryItemRecord(input: InventoryItemInput) {
  return prisma.inventoryItem.create({
    data: {
      name: requireField(input.name, "Numele produsului"),
      category: input.category || "MEDICAMENT",
      sku: input.sku ?? null,
      batchNumber: input.batchNumber ?? null,
      manufacturer: input.manufacturer ?? null,
      supplier: input.supplier ?? null,
      quantity: input.quantity ?? 0,
      unit: input.unit || "buc",
      minQuantity: input.minQuantity ?? 0,
      expiresAt: input.expiresAt ?? null,
      storageLocation: input.storageLocation ?? null,
      status: input.status || "ACTIV",
      notes: input.notes ?? null,
    },
  });
}

export async function updateInventoryItemRecord(input: InventoryItemUpdateInput) {
  return prisma.inventoryItem.update({
    where: { id: requireField(input.id, "ID produs") },
    data: {
      name: requireField(input.name, "Numele produsului"),
      category: input.category || "MEDICAMENT",
      sku: input.sku ?? null,
      batchNumber: input.batchNumber ?? null,
      manufacturer: input.manufacturer ?? null,
      supplier: input.supplier ?? null,
      quantity: input.quantity ?? 0,
      unit: input.unit || "buc",
      minQuantity: input.minQuantity ?? 0,
      expiresAt: input.expiresAt ?? null,
      storageLocation: input.storageLocation ?? null,
      status: input.status || "ACTIV",
      notes: input.notes ?? null,
    },
  });
}

export async function deleteInventoryItemRecord(id: string) {
  return prisma.inventoryItem.delete({
    where: { id: requireField(id, "ID produs") },
  });
}
