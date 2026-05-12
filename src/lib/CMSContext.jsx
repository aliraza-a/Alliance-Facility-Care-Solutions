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
  const [heroSections, setHeroSections] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
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
            setPages((pages) =>
              pages
                .map((p) => (p.id === payload.new.id ? payload.new : p))
                .concat(payload.new),
            );
          }
        },
      )
      .subscribe();

    const heroSubscription = supabase
      .channel("hero_sections")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hero_sections" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setHeroSections((sections) =>
              sections.filter((s) => s.id !== payload.old.id),
            );
          } else {
            setHeroSections((sections) =>
              sections
                .map((s) => (s.id === payload.new.id ? payload.new : s))
                .concat(payload.new),
            );
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
            setTestimonials((items) =>
              items
                .map((i) => (i.id === payload.new.id ? payload.new : i))
                .concat(payload.new),
            );
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
            setFaqs((items) =>
              items
                .map((i) => (i.id === payload.new.id ? payload.new : i))
                .concat(payload.new),
            );
          }
        },
      )
      .subscribe();

    return () => {
      settingsSubscription.unsubscribe();
      pagesSubscription.unsubscribe();
      heroSubscription.unsubscribe();
      testimonialsSubscription.unsubscribe();
      faqsSubscription.unsubscribe();
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
        .single();
      setSettings(settingsData);

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

      // Fetch hero sections
      const { data: heroData } = await supabase
        .from("hero_sections")
        .select("*")
        .eq("is_active", true);
      setHeroSections(heroData || []);

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
        .order("service_order");
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

  // Get hero section by page slug
  const getHeroByPageSlug = (slug) => {
    return heroSections.find((h) => h.page_slug === slug);
  };

  // Update settings
  const updateSettings = async (updates) => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .update(updates)
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
    heroSections,
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
