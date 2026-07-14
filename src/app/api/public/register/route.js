import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      name, email, phone, plan, birthday, business,
      occupation, has_business, business_details, social_media,
      sales_type, main_goal, main_struggle, marketing_level,
      ai_level, sales_level, ref_code
    } = data;

    if (!name || !email || !plan) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (nombre, email, plan).' }, { status: 400 });
    }

    // Load settings to determine current stage and prices
    const settingsResult = await db.execute('SELECT * FROM settings');
    const config = {};
    settingsResult.rows.forEach(s => config[s.key] = s.value);

    const current_stage = config.current_stage || 'Pre-venta';
    const stageKey = current_stage.toLowerCase().replace(/ |-/g, ''); // "Pre-venta" -> "preventa", "Etapa 1" -> "etapa1"
    const priceKey = plan === 'VIP' ? `price_vip_${stageKey}` : `price_general_${stageKey}`;
    const ticket_price = parseFloat(config[priceKey]) || 0;

    let agent_id = null;
    if (ref_code) {
      const agentResult = await db.execute({
        sql: 'SELECT id FROM sales_agents WHERE ref_code = ?',
        args: [ref_code]
      });
      const agent = agentResult.rows[0];
      if (agent) {
        agent_id = agent.id;
      }
    }

    const ticket_id = crypto.randomBytes(4).toString('hex');

    await db.execute({
      sql: `
        INSERT INTO registrations (
          name, email, phone, plan, birthday, business, status, purchase_stage,
          occupation, has_business, business_details, social_media,
          sales_type, main_goal, main_struggle, marketing_level, ai_level, sales_level,
          ticket_price, agent_id, ticket_id
        )
        VALUES (?, ?, ?, ?, ?, ?, 'Nuevo', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        name, email, phone || '', plan, birthday || '', business || '', current_stage,
        occupation || '', has_business || '', business_details || '', social_media || '',
        sales_type || '', main_goal || '', main_struggle || '', marketing_level || '',
        ai_level || '', sales_level || '', ticket_price, agent_id, ticket_id
      ]
    });

    return NextResponse.json({ success: true, message: 'Registro exitoso' });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor. Inténtalo de nuevo.' }, { status: 500 });
  }
}
