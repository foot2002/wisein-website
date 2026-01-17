// Migration utility: localStorage → Supabase
// Run this function once to migrate existing localStorage data to Supabase

import { supabase, isSupabaseEnabled } from './supabase';
import { 
  getPortfolioItems, 
  getBlogPosts, 
  getInquiries, 
  getAnnouncements, 
  getPressReleases, 
  getNewsletterSubscribers 
} from './adminStorage';

export async function migrateLocalStorageToSupabase() {
  if (!isSupabaseEnabled() || !supabase) {
    console.error('Supabase is not enabled. Cannot migrate.');
    return { success: false, error: 'Supabase not enabled' };
  }

  const results = {
    portfolio: { success: 0, failed: 0 },
    blog: { success: 0, failed: 0 },
    inquiries: { success: 0, failed: 0 },
    announcements: { success: 0, failed: 0 },
    press: { success: 0, failed: 0 },
    newsletter: { success: 0, failed: 0 },
  };

  try {
    // Migrate Portfolio
    const portfolioItems = await getPortfolioItems();
    for (const item of portfolioItems) {
      try {
        const { error } = await supabase
          .from('portfolio')
          .upsert({
            id: item.id,
            category: item.category,
            client: item.client,
            title: item.title,
            description: item.description,
            year: item.year,
            tags: item.tags,
            image_url: item.imageUrl,
            created_at: item.createdAt,
            updated_at: item.updatedAt,
          }, { onConflict: 'id' });
        
        if (error) throw error;
        results.portfolio.success++;
      } catch (error) {
        console.error(`Failed to migrate portfolio item ${item.id}:`, error);
        results.portfolio.failed++;
      }
    }

    // Migrate Blog
    const blogPosts = await getBlogPosts();
    for (const post of blogPosts) {
      try {
        const { error } = await supabase
          .from('blog')
          .upsert({
            id: post.id,
            category: post.category,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            date: post.date,
            read_time: post.readTime,
            image_url: post.imageUrl,
            created_at: post.createdAt,
            updated_at: post.updatedAt,
          }, { onConflict: 'id' });
        
        if (error) throw error;
        results.blog.success++;
      } catch (error) {
        console.error(`Failed to migrate blog post ${post.id}:`, error);
        results.blog.failed++;
      }
    }

    // Migrate Inquiries (localStorage에서 직접 읽기)
    const inquiriesData = localStorage.getItem('admin_inquiries');
    const inquiries = inquiriesData ? JSON.parse(inquiriesData) : [];
    for (const inquiry of inquiries) {
      try {
        const { error } = await supabase
          .from('inquiries')
          .upsert({
            id: inquiry.id,
            name: inquiry.name,
            email: inquiry.email,
            company: inquiry.company,
            phone: inquiry.phone,
            type: inquiry.type,
            message: inquiry.message,
            reply: inquiry.reply,
            replied_at: inquiry.repliedAt,
            created_at: inquiry.createdAt,
            status: inquiry.status,
          }, { onConflict: 'id' });
        
        if (error) throw error;
        results.inquiries.success++;
      } catch (error) {
        console.error(`Failed to migrate inquiry ${inquiry.id}:`, error);
        results.inquiries.failed++;
      }
    }

    // Migrate Announcements
    const announcements = await getAnnouncements();
    for (const announcement of announcements) {
      try {
        const { error } = await supabase
          .from('announcements')
          .upsert({
            id: announcement.id,
            title: announcement.title,
            date: announcement.date,
            category: announcement.category,
            content: announcement.content,
            created_at: announcement.createdAt,
            updated_at: announcement.updatedAt,
          }, { onConflict: 'id' });
        
        if (error) throw error;
        results.announcements.success++;
      } catch (error) {
        console.error(`Failed to migrate announcement ${announcement.id}:`, error);
        results.announcements.failed++;
      }
    }

    // Migrate Press Releases
    const pressReleases = await getPressReleases();
    for (const press of pressReleases) {
      try {
        const { error } = await supabase
          .from('press_releases')
          .upsert({
            id: press.id,
            title: press.title,
            date: press.date,
            source: press.source,
            url: press.url,
            created_at: press.createdAt,
            updated_at: press.updatedAt,
          }, { onConflict: 'id' });
        
        if (error) throw error;
        results.press.success++;
      } catch (error) {
        console.error(`Failed to migrate press release ${press.id}:`, error);
        results.press.failed++;
      }
    }

    // Migrate Newsletter Subscribers (localStorage에서 직접 읽기)
    const newsletterData = localStorage.getItem('admin_newsletter');
    const subscribers = newsletterData ? JSON.parse(newsletterData) : [];
    for (const subscriber of subscribers) {
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .upsert({
            id: subscriber.id,
            email: subscriber.email,
            created_at: subscriber.createdAt,
          }, { onConflict: 'id' });
        
        if (error) throw error;
        results.newsletter.success++;
      } catch (error) {
        console.error(`Failed to migrate subscriber ${subscriber.id}:`, error);
        results.newsletter.failed++;
      }
    }

    console.log('Migration completed:', results);
    return { success: true, results };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error, results };
  }
}
