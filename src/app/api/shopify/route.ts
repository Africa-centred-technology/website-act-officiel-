import { NextRequest, NextResponse } from "next/server";

/**
 * API Route pour traiter les inscriptions aux formations
 * POST /api/formations/inscription
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validation basique
    if (!data.email || !data.nom || !data.prenom) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    if (!data.consentementRGPD) {
      return NextResponse.json(
        { success: false, error: "Consentement RGPD requis" },
        { status: 400 }
      );
    }

    // Log l'inscription (à remplacer par sauvegarde BDD)
    console.log("📝 Nouvelle inscription:", {
      type: data.typeClient,
      nom: `${data.prenom} ${data.nom}`,
      email: data.email,
      formation: data.formationSouhaitee,
      timestamp: data.timestamp
    });

    // TODO: Sauvegarder dans la base de données
    // await db.inscriptions.create({ data });

    // TODO: Envoyer email de confirmation
    // await sendConfirmationEmail(data);

    // TODO: Envoyer notification à l'équipe ACT
    // await sendNotificationToTeam(data);

    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Réponse succès
    return NextResponse.json({
      success: true,
      message: "Inscription enregistrée avec succès",
      inscriptionId: `INS-${Date.now()}`, // Générer un vrai UUID en production
      emailSent: true
    });

  } catch (error) {
    console.error("❌ Erreur inscription:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Rate limiting simple (à améliorer avec Redis en production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 heure
    return true;
  }

  if (record.count >= 3) {
    return false; // Max 3 soumissions par heure
  }

  record.count++;
  return true;
}
