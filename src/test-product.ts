import { supabase, signIn } from './lib/supabase';

async function testAddProduct() {
  try {
    // First, sign in as an admin user
    const { data: authData, error: authError } = await signIn(
      'your-admin@email.com', // Replace with your admin email
      'your-password'         // Replace with your admin password
    );

    if (authError) {
      console.error('Authentication error:', authError);
      return;
    }

    console.log('Authenticated successfully');

    // Now try to add the product
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: 'מגבה שטח מקצועי PRO',
          description: 'מגבה שטח איכותי עם כושר הרמה של 4 טון, מתאים לכל סוגי רכבי השטח',
          price: 1299,
          category_id: '1', // יש להחליף למזהה קטגוריה קיים
          stock: 50,
          slug: 'pro-offroad-jack',
          image_url: 'https://images.unsplash.com/photo-1621252179027-94459d278660'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return;
    }

    console.log('Product added successfully:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAddProduct();