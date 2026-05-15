import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { toast } from "sonner";

const CMSContext = createContext();

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within CMSProvider");
  }
  return context;
}

export function CMSProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [pages, setPages] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
  const [heroSections, setHeroSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all CMS data on mount
  useEffect(() => {
    fetchAllCMSData();

    // Set up real-time subscriptions
    const settingsSubscription = supabase
      .channel("site_settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload) => {
          setSettings(payload.new);
        },
      )
      .subscribe();

    const pagesSubscription = supabase
      .channel("pages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pages" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setPages((pages) => pages.filter((p) => p.id !== payload.old.id));
          } else {
            setPages((currentPages) => {
              const exists = currentPages.find((p) => p.id === payload.new.id);
              if (exists) {
                return currentPages.map((p) =>
                  p.id === payload.new.id ? payload.new : p
                );
              }
              return [...currentPages, payload.new];
            });
          }
        },
      )
      .subscribe();

    const testimonialsSubscription = supabase
      .channel("testimonials")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setTestimonials((items) =>
              items.filter((i) => i.id !== payload.old.id),
            );
          } else {
            setTestimonials((currentItems) => {
              const exists = currentItems.find((i) => i.id === payload.new.id);
              if (exists) {
                return currentItems.map((i) =>
                  i.id === payload.new.id ? payload.new : i
                );
              }
              return [...currentItems, payload.new];
            });
          }
        },
      )
      .subscribe();

    const faqsSubscription = supabase
      .channel("faqs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "faqs" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setFaqs((items) => items.filter((i) => i.id !== payload.old.id));
          } else {
            setFaqs((currentItems) => {
              const exists = currentItems.find((i) => i.id === payload.new.id);
              if (exists) {
                return currentItems.map((i) =>
                  i.id === payload.new.id ? payload.new : i
                );
              }
              return [...currentItems, payload.new];
            });
          }
        },
      )
      .subscribe();

    const servicesSubscription = supabase
      .channel("services")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setServices((items) => items.filter((i) => i.id !== payload.old.id));
          } else {
            setServices((currentItems) => {
              const exists = currentItems.find((i) => i.id === payload.new.id);
              if (exists) {
                return currentItems.map((i) =>
                  i.id === payload.new.id ? payload.new : i
                );
              }
              return [...currentItems, payload.new];
            });
          }
        },
      )
      .subscribe();

    const heroSectionsSubscription = supabase
      .channel("hero_sections")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hero_sections" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setHeroSections((items) => items.filter((i) => i.id !== payload.old.id));
          } else {
            setHeroSections((currentItems) => {
              const exists = currentItems.find((i) => i.id === payload.new.id);
              if (exists) {
                return currentItems.map((i) =>
                  i.id === payload.new.id ? payload.new : i
                );
              }
              // Only add if is_active
              if (payload.new.is_active) return [...currentItems, payload.new];
              return currentItems;
            });
          }
        },
      )
      .subscribe();

    return () => {
      settingsSubscription.unsubscribe();
      pagesSubscription.unsubscribe();
      testimonialsSubscription.unsubscribe();
      faqsSubscription.unsubscribe();
      servicesSubscription.unsubscribe();
      heroSectionsSubscription.unsubscribe();
    };
  }, []);

  async function fetchAllCMSData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();
      setSettings(settingsData);

      // Fetch hero sections
      const { data: heroSectionsData } = await supabase
        .from("hero_sections")
        .select("*")
        .eq("is_active", true);
      setHeroSections(heroSectionsData || []);

      // Fetch published pages
      const { data: pagesData } = await supabase
        .from("pages")
        .select("*")
        .eq("is_published", true)
        .order("menu_order");
      setPages(pagesData || []);

      // Fetch navigation menu
      const { data: navData } = await supabase
        .from("navigation_menu")
        .select("*")
        .eq("is_active", true)
        .order("menu_order");
      setNavigation(navData || []);

      // Fetch home sections
      const { data: homeSectionsData } = await supabase
        .from("home_sections")
        .select("*")
        .eq("is_active", true)
        .order("section_order");
      setHomeSections(homeSectionsData || []);

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      setTestimonials(testimonialsData || []);

      // Fetch FAQs
      const { data: faqsData } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .order("order_index");
      setFaqs(faqsData || []);

      // Fetch services
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      setServices(servicesData || []);
    } catch (err) {
      console.error("Error fetching CMS data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Get page by slug
  const getPageBySlug = (slug) => {
    return pages.find((p) => p.slug === slug);
  };
  // Get hero section by page slug.
  // Priority: dedicated hero_sections table → pages table hero fields
  const getHeroByPageSlug = (slug) => {
    // 1. Check dedicated hero_sections table first
    const heroSection = heroSections.find((h) => h.page_slug === slug);
    if (heroSection) {
      return {
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        description: heroSection.description,
        image_url: heroSection.image_url,
        badge_text: heroSection.cta_text,
        background_type: heroSection.background_type || "image",
        background_video_url: heroSection.background_video_url,
      };
    }

    // 2. Fall back to pages table hero fields (set via Edit Page → Hero tab)
    const page = pages.find((p) => p.slug === slug);
    if (!page) return null;
    return {
      title: page.hero_title,
      subtitle: page.hero_subtitle,
      description: page.hero_description,
      image_url: page.hero_image_url,
      badge_text: null,
      background_type: page.hero_background_type || "image",
      background_video_url: page.hero_video_url,
    };
  };

  // Update settings
  const updateSettings = async (updates) => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .update(updates)
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      toast.success("Settings updated");
      return data;
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error(err.message);
      throw err;
    }
  };

  const value = {
    // Data
    settings,
    pages,
    navigation,
    homeSections,
    testimonials,
    faqs,
    services,
    loading,
    error,

    // Methods
    fetchAllCMSData,
    getPageBySlug,
    getHeroByPageSlug,
    updateSettings,
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}
