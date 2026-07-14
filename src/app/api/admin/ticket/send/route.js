import { NextResponse } from 'next/server';
import db from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'SELECT * FROM registrations WHERE id = ?',
      args: [id]
    });
    const client = result.rows[0];

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // SMTP Configuration
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return NextResponse.json({ error: 'Servidor SMTP no configurado. Configura SMTP_USER y SMTP_PASS en el archivo .env.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort == 465, 
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Determine base URL from headers or env
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    
    const ticketUrl = `${baseUrl}/ticket/${client.ticket_id}`;

    // Simple QR using public API for the email body
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticketUrl)}`;

    const mailOptions = {
      from: `"Marketing Xperience" <${smtpUser}>`,
      to: client.email,
      subject: `Tu Entrada Digital - ${client.plan.split('(')[0].trim()} | Marketing Xperience`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #0f172a; padding: 30px; text-align: center; color: #fff;">
            <h1 style="margin: 0; color: #4a89a7;">Marketing Xperience</h1>
            <p style="margin: 10px 0 0 0; color: #cbd5e1;">¡Tu registro está confirmado!</p>
          </div>
          <div style="padding: 30px; background: #f8fafc; color: #0f172a;">
            <h2 style="margin-top: 0;">Hola, ${client.name}</h2>
            <p>Aquí tienes tu entrada digital para el evento. Presenta el código QR en la entrada el día del evento.</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #fff; display: inline-block; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <img src="${qrUrl}" alt="QR Code" style="width: 200px; height: 200px; display: block;" />
              </div>
            </div>
            <div style="background: #e2e8f0; padding: 15px; border-radius: 8px; text-align: center;">
              <strong style="color: #64748b; font-size: 0.9rem;">TIPO DE ENTRADA</strong><br/>
              <span style="font-size: 1.2rem; font-weight: bold; color: ${client.plan.includes('VIP') ? '#c19845' : '#4a89a7'};">${client.plan.split('(')[0].trim()}</span>
              <br/><br/>
              <strong style="color: #64748b; font-size: 0.9rem;">CÓDIGO DE TICKET</strong><br/>
              <span style="font-family: monospace; font-size: 1.1rem;">${client.ticket_id}</span>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${ticketUrl}" style="background: #4a89a7; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ver mi Entrada en Línea</a>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Error interno al enviar el correo.' }, { status: 500 });
  }
}
