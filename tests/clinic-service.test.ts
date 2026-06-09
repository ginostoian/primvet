import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  createAppointmentRecord,
  createInventoryItemRecord,
  createIntake,
  createMedicalEventRecord,
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
import { prisma } from "@/lib/db";

const describeDb = process.env.TEST_DATABASE_URL ? describe : describe.skip;

async function clearDatabase() {
  await prisma.$transaction([
    prisma.treatmentPlanItem.deleteMany(),
    prisma.treatmentPlan.deleteMany(),
    prisma.procedureRecord.deleteMany(),
    prisma.imagingStudy.deleteMany(),
    prisma.labResult.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.vaccinationRecord.deleteMany(),
    prisma.soapNote.deleteMany(),
    prisma.medicalEvent.deleteMany(),
    prisma.checkIn.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.appointmentType.deleteMany(),
    prisma.room.deleteMany(),
    prisma.staffMember.deleteMany(),
    prisma.intakeSubmission.deleteMany(),
    prisma.pet.deleteMany(),
    prisma.owner.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.adminSession.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.inventoryItem.deleteMany(),
    prisma.adminUser.deleteMany(),
  ]);
}

async function createOwnerPetFixture() {
  return createOwnerAndPet({
    firstName: "Maria",
    lastName: "Popescu",
    phone: "0712345678",
    email: "maria@example.local",
    city: "Iași",
    gdprConsentAt: new Date("2026-06-07T09:00:00.000Z"),
    petName: "Rex",
    species: "Câine",
    breed: "Metis",
    sex: "MASCUL",
    weightKg: 18.5,
    allergies: "Fără alergii cunoscute",
  });
}

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describeDb("intake submissions", () => {
  it("creates, triages, archives and deletes public submissions", async () => {
    const intake = await createIntake({
      ownerName: "Maria Popescu",
      ownerPhone: "0712345678",
      ownerEmail: "maria@example.local",
      petName: "Rex",
      species: "Câine",
      reason: "Nu mănâncă de ieri.",
      urgency: "RAPID",
    });

    expect(intake.status).toBe("IN_ASTEPTARE");
    expect(intake.source).toBe("WEBSITE");

    const respondedAt = new Date("2026-06-07T10:00:00.000Z");
    const answered = await updateIntake({
      id: intake.id,
      status: "RASPUNS",
      response: "Am sunat proprietarul.",
      triageNotes: "Consult recomandat azi.",
      now: respondedAt,
    });

    expect(answered.status).toBe("RASPUNS");
    expect(answered.response).toBe("Am sunat proprietarul.");
    expect(answered.respondedAt?.toISOString()).toBe(respondedAt.toISOString());

    const archivedAt = new Date("2026-06-07T11:00:00.000Z");
    const archived = await updateIntake({
      id: intake.id,
      status: "ARHIVAT",
      now: archivedAt,
    });

    expect(archived.archivedAt?.toISOString()).toBe(archivedAt.toISOString());

    await deleteIntakeById(intake.id);
    await expect(
      prisma.intakeSubmission.findUnique({ where: { id: intake.id } }),
    ).resolves.toBeNull();
  });
});

describeDb("owners and patients", () => {
  it("creates an owner with a first pet and supports one-to-many pets", async () => {
    const owner = await createOwnerPetFixture();

    expect(owner.pets).toHaveLength(1);
    expect(owner.pets[0]?.name).toBe("Rex");
    expect(owner.pets[0]?.ownerId).toBe(owner.id);

    await prisma.pet.create({
      data: {
        ownerId: owner.id,
        name: "Mia",
        species: "Pisică",
        breed: "Europeană",
      },
    });

    const withPets = await prisma.owner.findUnique({
      where: { id: owner.id },
      include: { pets: true },
    });

    expect(withPets?.pets.map((pet) => pet.name).sort()).toEqual(["Mia", "Rex"]);
  });

  it("updates and deletes owners and patients", async () => {
    const owner = await createOwnerPetFixture();
    const pet = owner.pets[0]!;

    const updatedOwner = await updateOwnerRecord({
      id: owner.id,
      firstName: "Maria",
      lastName: "Ionescu",
      phone: "0799999999",
      email: "maria.ionescu@example.local",
      preferredContact: "WHATSAPP",
      marketingConsent: true,
    });

    expect(updatedOwner.lastName).toBe("Ionescu");
    expect(updatedOwner.marketingConsent).toBe(true);

    const updatedPet = await updatePetRecord({
      id: pet.id,
      name: "Rex Junior",
      species: "Câine",
      breed: "Metis",
      weightKg: 19.2,
      active: true,
    });

    expect(updatedPet.name).toBe("Rex Junior");
    expect(updatedPet.weightKg).toBe(19.2);

    await deletePetRecord(pet.id);
    await expect(prisma.pet.findUnique({ where: { id: pet.id } })).resolves.toBeNull();

    await deleteOwnerRecord(owner.id);
    await expect(prisma.owner.findUnique({ where: { id: owner.id } })).resolves.toBeNull();
  });
});

describeDb("medical timeline", () => {
  it("creates a medical event with a linked SOAP note", async () => {
    const owner = await createOwnerPetFixture();
    const petId = owner.pets[0]!.id;

    const event = await createMedicalEventRecord({
      petId,
      type: "CONSULTATIE",
      title: "Consultație apatie",
      occurredAt: new Date("2026-06-07T12:00:00.000Z"),
      summary: "Pacient apatic, apetit redus.",
      diagnosis: "Gastroenterită suspectă",
      treatment: "Tratament simptomatic",
      recommendations: "Monitorizare 24h",
      costCents: toCents(180),
      subjective: "Proprietarul raportează lipsa apetitului.",
      objective: "Temperatură normală, abdomen sensibil.",
      assessment: "Stare generală moderat alterată.",
      plan: "Analize dacă nu se ameliorează.",
    });

    expect(event.petId).toBe(petId);
    expect(event.costCents).toBe(18000);
    expect(event.soapNote?.subjective).toContain("lipsa apetitului");

    const timeline = await prisma.medicalEvent.findMany({
      where: { petId },
      include: { soapNote: true },
      orderBy: { occurredAt: "desc" },
    });

    expect(timeline).toHaveLength(1);
    expect(timeline[0]?.soapNote?.plan).toContain("Analize");
  });
});

describeDb("calendar and check-in", () => {
  it("creates appointments with calculated end time and updates status", async () => {
    const owner = await createOwnerPetFixture();
    const pet = owner.pets[0]!;
    const staff = await prisma.staffMember.create({
      data: { name: "Dr. Ionescu", role: "MEDIC" },
    });
    const room = await prisma.room.create({ data: { name: "Cabinet 1" } });
    const type = await prisma.appointmentType.create({
      data: { name: "Consultație", durationMinutes: 45 },
    });

    const startAt = new Date("2026-06-07T13:00:00.000Z");
    const appointment = await createAppointmentRecord({
      ownerId: owner.id,
      petId: pet.id,
      staffMemberId: staff.id,
      roomId: room.id,
      appointmentTypeId: type.id,
      startAt,
      durationMinutes: 45,
      reason: "Control apatie",
    });

    expect(appointment.status).toBe("PROGRAMATA");
    expect(appointment.endAt.toISOString()).toBe("2026-06-07T13:45:00.000Z");

    const confirmed = await updateAppointmentStatusRecord(
      appointment.id,
      "CONFIRMATA",
    );

    expect(confirmed.status).toBe("CONFIRMATA");
  });

  it("rejects invalid appointment statuses", async () => {
    const owner = await createOwnerPetFixture();
    const pet = owner.pets[0]!;
    const appointment = await createAppointmentRecord({
      ownerId: owner.id,
      petId: pet.id,
      startAt: new Date("2026-06-07T13:00:00.000Z"),
      durationMinutes: 30,
      reason: "Control",
    });

    await expect(
      updateAppointmentStatusRecord(appointment.id, "INVALID"),
    ).rejects.toThrow("Status programare invalid.");
  });

  it("starts one check-in per appointment and finalizes checkout", async () => {
    const owner = await createOwnerPetFixture();
    const pet = owner.pets[0]!;
    const appointment = await createAppointmentRecord({
      ownerId: owner.id,
      petId: pet.id,
      startAt: new Date("2026-06-07T14:00:00.000Z"),
      durationMinutes: 30,
      reason: "Consult",
    });
    const now = new Date("2026-06-07T13:55:00.000Z");

    const firstCheckIn = await startCheckInRecord({
      appointmentId: appointment.id,
      presentingComplaint: "Apatie",
      estimatedCostCents: toCents(250),
      consentSigned: true,
      now,
    });
    const secondCheckIn = await startCheckInRecord({
      appointmentId: appointment.id,
      presentingComplaint: "Apatie continuă",
      estimatedCostCents: toCents(300),
      consentSigned: true,
      now,
    });

    expect(secondCheckIn.id).toBe(firstCheckIn.id);
    expect(await prisma.checkIn.count()).toBe(1);
    expect(secondCheckIn.estimatedCostCents).toBe(30000);

    const checkedAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
    });
    expect(checkedAppointment?.status).toBe("SOSIT");

    const checkedOutAt = new Date("2026-06-07T15:00:00.000Z");
    const finished = await finishCheckInRecord({
      id: firstCheckIn.id,
      dischargeNotes: "Externat stabil.",
      paymentStatus: "PLATIT",
      paidCents: toCents(300),
      now: checkedOutAt,
    });

    expect(finished.status).toBe("FINALIZAT");
    expect(finished.checkedOutAt?.toISOString()).toBe(checkedOutAt.toISOString());

    const finalAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
    });
    expect(finalAppointment?.status).toBe("FINALIZATA");
  });
});

describeDb("treatment plans", () => {
  it("creates treatment plans with required first item and stores money as cents", async () => {
    const owner = await createOwnerPetFixture();
    const pet = owner.pets[0]!;

    const plan = await createTreatmentPlanRecord({
      ownerId: owner.id,
      petId: pet.id,
      title: "Plan gastroenterită",
      status: "APROBAT",
      diagnosis: "Gastroenterită suspectă",
      totalEstimatedCents: toCents(420.5),
      approvedByName: "Maria Popescu",
      itemKind: "MEDICAMENT",
      itemName: "Antiemetic",
      dosage: "1 ml",
      frequency: "BID",
      duration: "3 zile",
      itemCostCents: toCents(120),
      instructions: "Administrare conform recomandării medicului.",
      now: new Date("2026-06-07T16:00:00.000Z"),
    });

    expect(plan.status).toBe("APROBAT");
    expect(plan.approvedAt).not.toBeNull();
    expect(plan.totalEstimatedCents).toBe(42050);
    expect(plan.items).toHaveLength(1);
    expect(plan.items[0]?.estimatedCostCents).toBe(12000);
  });
});

describeDb("inventory", () => {
  it("creates, updates and deletes inventory items with expiry and stock data", async () => {
    const item = await createInventoryItemRecord({
      name: "Antibiotic X",
      category: "MEDICAMENT",
      batchNumber: "LOT-123",
      quantity: 10,
      unit: "flacon",
      minQuantity: 2,
      expiresAt: new Date("2026-12-31T00:00:00.000Z"),
      storageLocation: "Frigider 1",
    });

    expect(item.quantity).toBe(10);
    expect(item.expiresAt?.toISOString()).toBe("2026-12-31T00:00:00.000Z");

    const updated = await updateInventoryItemRecord({
      id: item.id,
      name: "Antibiotic X",
      category: "MEDICAMENT",
      batchNumber: "LOT-123",
      quantity: 4,
      unit: "flacon",
      minQuantity: 5,
      status: "ACTIV",
    });

    expect(updated.quantity).toBe(4);
    expect(updated.minQuantity).toBe(5);

    await deleteInventoryItemRecord(item.id);
    await expect(
      prisma.inventoryItem.findUnique({ where: { id: item.id } }),
    ).resolves.toBeNull();
  });
});
