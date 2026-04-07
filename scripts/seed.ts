/**
 * Seed script for Super Babi Invest
 * 
 * Run with: npx tsx scripts/seed.ts
 * 
 * Note: You need to set SUPABASE_SERVICE_ROLE_KEY in your environment
 * Get it from: Supabase Dashboard > Project Settings > API > service_role key
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oipmmoyadvljohtgvbwf.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('Get it from: Supabase Dashboard > Project Settings > API > service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seed() {
  console.log('🌱 Starting seed...');

  // Create test users
  const testUsers = [
    { email: 'member1@test.com', password: 'password123', name: 'John Doe', phone: '+6281234567890', bank: 'BCA - 1234567890', status: 'approved' },
    { email: 'member2@test.com', password: 'password123', name: 'Jane Smith', phone: '+6281234567891', bank: 'Mandiri - 0987654321', status: 'approved' },
    { email: 'pending@test.com', password: 'password123', name: 'Pending User', phone: '+6281234567892', bank: 'BNI - 1122334455', status: 'pending' },
  ];

  const createdUsers: { id: string; email: string }[] = [];

  for (const user of testUsers) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`⚠️  User ${user.email} already exists, skipping...`);
        // Get existing user
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existing = existingUsers?.users?.find(u => u.email === user.email);
        if (existing) createdUsers.push({ id: existing.id, email: user.email });
        continue;
      }
      console.error(`Error creating user ${user.email}:`, authError.message);
      continue;
    }

    if (authData.user) {
      createdUsers.push({ id: authData.user.id, email: user.email });
      console.log(`✅ Created user: ${user.email}`);

      // Create profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: authData.user.id,
        full_name: user.name,
        email: user.email,
        phone: user.phone,
        bank_account: user.bank,
        status: user.status,
      }, { onConflict: 'user_id' });

      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`✅ Created profile for: ${user.email} (${user.status})`);
      }
    }
  }

  // Add master rates
  const rates = [
    { rate: 30, effective_date: '2026-01-01' },
    { rate: 32, effective_date: '2026-04-01' },
  ];

  for (const rate of rates) {
    const { error } = await supabase.from('master_rates').upsert(rate, { onConflict: 'effective_date' });
    if (error && !error.message.includes('duplicate')) {
      console.error('Error adding rate:', error.message);
    } else {
      console.log(`✅ Added rate: ${rate.rate}% effective ${rate.effective_date}`);
    }
  }

  // Add deposits for approved users
  const approvedUser = createdUsers.find(u => u.email === 'member1@test.com');
  if (approvedUser) {
    const deposits = [
      { user_id: approvedUser.id, amount: 10000000, units: 1, status: 'pending', deposit_date: '2026-04-01' },
      { user_id: approvedUser.id, amount: 25000000, units: 2, status: 'approved', deposit_date: '2026-03-15' },
    ];

    for (const deposit of deposits) {
      const { data, error } = await supabase.from('deposits').insert(deposit).select().single();
      if (error) {
        console.error('Error adding deposit:', error.message);
      } else {
        console.log(`✅ Added deposit: ${deposit.amount} (${deposit.status})`);
        
        // Create investment for approved deposit
        if (deposit.status === 'approved' && data) {
          const { error: invError } = await supabase.from('investments').insert({
            user_id: approvedUser.id,
            deposit_id: data.id,
            amount: deposit.amount,
            activation_date: deposit.deposit_date,
            maturity_6_date: '2026-09-15',
            maturity_12_date: '2027-03-15',
            return_6: deposit.amount * 0.16,
            return_12: deposit.amount * 0.32,
            status: 'active',
          });
          if (!invError) console.log(`✅ Created investment for deposit`);
        }
      }
    }

    // Add notifications
    const { error: notifError } = await supabase.from('notifications').insert({
      user_id: approvedUser.id,
      title: 'Welcome to Super Babi!',
      message: 'Your account has been approved. Start investing today!',
      type: 'general',
    });
    if (!notifError) console.log(`✅ Added welcome notification`);
  }

  console.log('\n🎉 Seed completed!');
  console.log('\nTest accounts:');
  console.log('  member1@test.com / password123 (approved)');
  console.log('  member2@test.com / password123 (approved)');
  console.log('  pending@test.com / password123 (pending approval)');
}

seed().catch(console.error);
