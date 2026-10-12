"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  User,
  Tag,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MapPin,
  Clock,
  Sparkles,
  Loader2,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import SectionDivider from "./SectionDivider";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  hp: string; // Honeypot spam trap
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    hp: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const myEmail = "amarmicrosoft2021@gmail.com";

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(myEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required.";
    } else if (formData.subject.trim().length < 2) {
      newErrors.subject = "Subject must be at least 2 characters.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear inline error on edit
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitStatus === "error") {
      setSubmitStatus("idle");
      setServerMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setServerMessage(data.message || "Thank you! Your message has been delivered.");
        setFormData({ name: "", email: "", subject: "", message: "", hp: "" });
        setErrors({});
      } else {
        setSubmitStatus("error");
        setServerMessage(
          data.error || "Failed to send your message. Please check the fields or try again."
        );
      }
    } catch (err: unknown) {
      setSubmitStatus("error");
      setServerMessage(
        "Network connection error. Please verify your internet connection or email directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitStatus("idle");
    setServerMessage("");
    setErrors({});
  };

  return (
    <section
      id="contact"
      className="relative z-10 pt-16 md:pt-20 pb-0 scroll-mt-28 md:scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2.5 font-heading">
            — GET IN TOUCH —
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            Contact
          </h2>
          <p className="text-[#A7A198] text-xs sm:text-sm max-w-xl mx-auto mt-3 font-normal leading-relaxed">
            Have a project inquiry, a career opportunity, or want to collaborate? Fill
            out the form below and your message will be delivered straight to my inbox.
          </p>
        </motion.div>

        {/* Main Grid: Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 max-w-6xl mx-auto items-start">
          {/* Left Column: Direct Contact Info (5 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Card 1: Let's Connect */}
            <div className="bg-[#151517] rounded-3xl p-6 sm:p-8 border border-[#302D28] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C7A46A]/[0.08] to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center gap-2 text-[#C7A46A] text-xs font-semibold tracking-wider uppercase mb-2 font-heading">
                <Sparkles size={14} />
                <span>Let&apos;s Connect</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F4F0E8] font-heading mb-3">
                Send a Message
              </h3>
              <p className="text-[#A7A198] text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                I am always excited to discuss new opportunities, innovative tech projects,
                or software engineering challenges. Feel free to reach out anytime.
              </p>

              {/* Status Pills */}
              <div className="space-y-3 pt-2">
                {/* Email item with copy */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#202023] border border-[#302D28] group transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#151517] border border-[#302D28] flex items-center justify-center text-[#C7A46A] flex-shrink-0">
                      <Mail size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-[#A7A198] font-medium">
                        Direct Email
                      </div>
                      <div className="text-xs sm:text-sm text-[#F4F0E8] font-medium truncate">
                        {myEmail}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleCopyEmail}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-[#151517] hover:bg-[#302D28] border border-[#302D28] hover:border-[#C7A46A]/50 text-[#A7A198] hover:text-[#C7A46A] transition-all ml-2 flex-shrink-0"
                    title={copiedEmail ? "Copied!" : "Copy email address"}
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </motion.button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#202023] border border-[#302D28]">
                  <div className="w-9 h-9 rounded-lg bg-[#151517] border border-[#302D28] flex items-center justify-center text-[#C7A46A] flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#A7A198] font-medium">
                      Location
                    </div>
                    <div className="text-xs sm:text-sm text-[#F4F0E8] font-medium">
                      Coimbatore, Tamil Nadu, India
                    </div>
                  </div>
                </div>

                {/* Response speed */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#202023] border border-[#302D28]">
                  <div className="w-9 h-9 rounded-lg bg-[#151517] border border-[#302D28] flex items-center justify-center text-[#C7A46A] flex-shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#A7A198] font-medium">
                      Response Time
                    </div>
                    <div className="text-xs sm:text-sm text-[#F4F0E8] font-medium">
                      Typically within 24 hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 mt-6 border-t border-[#302D28]/60">
                <div className="text-[11px] uppercase tracking-wider text-[#A7A198]/70 font-semibold mb-3">
                  Find Me Online
                </div>
                <div className="flex items-center gap-2.5">
                  {[
                    {
                      icon: Github,
                      href: "https://github.com/Amarnath2007",
                      label: "GitHub",
                    },
                    {
                      icon: Linkedin,
                      href: "https://www.linkedin.com/in/amarnath2007",
                      label: "LinkedIn",
                    },
                    {
                      icon: Instagram,
                      href: "https://www.instagram.com/da_matrix_404?igsh=MWpvbW15NXU4MG5sbA==",
                      label: "Instagram",
                    },
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] hover:text-[#C7A46A] hover:border-[#C7A46A]/50 transition-all shadow-sm"
                      aria-label={label}
                    >
                      <Icon size={17} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form (7 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-[#151517] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#302D28] shadow-2xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {submitStatus === "success" ? (
                  /* Success State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="py-10 px-4 text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#C7A46A]/15 border border-[#C7A46A]/40 flex items-center justify-center text-[#C7A46A] mb-5 shadow-lg shadow-[#C7A46A]/10">
                      <CheckCircle2 size={36} />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F0E8] font-heading mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[#A7A198] text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-8">
                      {serverMessage ||
                        "Thank you for reaching out. Your message has been sent to my email, and I will get back to you shortly."}
                    </p>

                    <motion.button
                      onClick={handleReset}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-xl bg-[#202023] hover:bg-[#302D28] border border-[#302D28] hover:border-[#C7A46A]/40 text-[#F4F0E8] text-xs uppercase tracking-wider font-semibold transition-all"
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  /* Form State */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    {/* Error Banner */}
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3"
                      >
                        <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 leading-relaxed">
                          {serverMessage || "Something went wrong. Please check the fields and try again."}
                        </div>
                      </motion.div>
                    )}

                    {/* Hidden Honeypot Field (Spam prevention) */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="hp"
                        value={formData.hp}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Name + Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#A7A198] mb-2 font-heading"
                        >
                          Name <span className="text-[#C7A46A]">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#736E67]">
                            <User size={15} />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            placeholder="Your full name"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#202023] border text-xs sm:text-sm text-[#F4F0E8] placeholder-[#736E67] focus:outline-none transition-all ${
                              errors.name
                                ? "border-red-500/60 focus:border-red-500"
                                : "border-[#302D28] focus:border-[#C7A46A]/60 focus:bg-[#252528]"
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1.5 text-[11px] text-red-400 font-medium">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#A7A198] mb-2 font-heading"
                        >
                          Email <span className="text-[#C7A46A]">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#736E67]">
                            <Mail size={15} />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            placeholder="your.email@example.com"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#202023] border text-xs sm:text-sm text-[#F4F0E8] placeholder-[#736E67] focus:outline-none transition-all ${
                              errors.email
                                ? "border-red-500/60 focus:border-red-500"
                                : "border-[#302D28] focus:border-[#C7A46A]/60 focus:bg-[#252528]"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1.5 text-[11px] text-red-400 font-medium">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#A7A198] mb-2 font-heading"
                      >
                        Subject <span className="text-[#C7A46A]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#736E67]">
                          <Tag size={15} />
                        </div>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          placeholder="e.g. Project Inquiry, Freelance, or Job Opportunity"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#202023] border text-xs sm:text-sm text-[#F4F0E8] placeholder-[#736E67] focus:outline-none transition-all ${
                            errors.subject
                              ? "border-red-500/60 focus:border-red-500"
                              : "border-[#302D28] focus:border-[#C7A46A]/60 focus:bg-[#252528]"
                          }`}
                        />
                      </div>
                      {errors.subject && (
                        <p className="mt-1.5 text-[11px] text-red-400 font-medium">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor="message"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#A7A198] font-heading"
                        >
                          Message <span className="text-[#C7A46A]">*</span>
                        </label>
                        <span className="text-[10px] text-[#736E67] font-medium">
                          {formData.message.length} / 3000
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute top-3.5 left-3.5 pointer-events-none text-[#736E67]">
                          <MessageSquare size={15} />
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          placeholder="Describe your project, inquiry, or question in detail..."
                          maxLength={3000}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#202023] border text-xs sm:text-sm text-[#F4F0E8] placeholder-[#736E67] focus:outline-none transition-all resize-none ${
                            errors.message
                              ? "border-red-500/60 focus:border-red-500"
                              : "border-[#302D28] focus:border-[#C7A46A]/60 focus:bg-[#252528]"
                          }`}
                        />
                      </div>
                      {errors.message && (
                        <p className="mt-1.5 text-[11px] text-red-400 font-medium">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={isSubmitting ? {} : { scale: 1.01 }}
                        whileTap={isSubmitting ? {} : { scale: 0.99 }}
                        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                          isSubmitting
                            ? "bg-[#C7A46A]/60 text-[#191919] cursor-not-allowed"
                            : "bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#191919] shadow-[#C7A46A]/15 cursor-pointer"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin text-[#191919]" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>
                      <p className="text-[11px] text-center text-[#736E67] mt-3 font-medium">
                        🛡️ Messages are securely delivered directly to my inbox via Resend.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
