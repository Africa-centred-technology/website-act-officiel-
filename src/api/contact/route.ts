import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, subject, budget, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être remplis" },
        { status: 400 }
      );
    }

    // Préparer le contenu de l'email
    const emailContent = `
Nouvelle demande de contact depuis le site ACT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMATIONS DU CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Nom complet : ${name}
📧 Email : ${email}
🏢 Entreprise : ${company || "Non renseigné"}
📱 Téléphone : ${phone || "Non renseigné"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DÉTAILS DE LA DEMANDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Type de projet : ${getProjectType(subject)}
💰 Budget estimé : ${getBudgetRange(budget)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date de réception : ${new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
    `.trim();

    // Utiliser Resend pour envoyer l'email
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY n'est pas configurée");
      return NextResponse.json(
        { error: "Configuration email manquante" },
        { status: 500 }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ACT Website <noreply@a-ct.ma>",
        to: ["aldrin.djourobi@a-ct.ma"],
        reply_to: email,
        subject: `🔔 Nouvelle demande de contact - ${getProjectType(subject)} - ${name}`,
        text: emailContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error("Erreur Resend:", errorData);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// Helpers
function getProjectType(value: string): string {
  const types: Record<string, string> = {
    web: "Application Web",
    mobile: "Application Mobile",
    ia: "IA & Data",
    sig: "SIG & Cartographie",
    media: "Plateforme Média",
    conseil: "Conseil Stratégique",
    autre: "Autre",
  };
  return types[value] || value;
}

function getBudgetRange(value: string): string {
  const budgets: Record<string, string> = {
    small: "5 000 – 15 000 MAD",
    medium: "15 000 – 50 000 MAD",
    large: "50 000 – 150 000 MAD",
    enterprise: "150 000 MAD +",
  };
  return budgets[value] || "Non renseigné";
}
