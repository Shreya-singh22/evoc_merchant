"use client";

import React from "react";
import { User, Mail } from "lucide-react";
import { customerDetailsSchema } from "@/lib/validation";

interface CustomerDetailsFormProps {
  firstName: string;
  lastName: string;
  email: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  fieldErrors: Record<string, string>;
  onFieldChange: (field: string) => void;
}

export default function CustomerDetailsForm({
  firstName,
  lastName,
  email,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  fieldErrors,
  onFieldChange,
}: CustomerDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                onFirstNameChange(e.target.value.replace(/[^a-zA-Z\s]/g, ""));
                onFieldChange("firstName");
              }}
              autoComplete="given-name"
              autoCapitalize="words"
              className={`w-full pl-10 pr-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary font-medium ${
                fieldErrors.firstName ? "border-red-400 bg-red-50/30" : "border-primary/10"
              }`}
            />
          </div>
          {fieldErrors.firstName && (
            <p className="text-[10px] text-red-500 font-bold">{fieldErrors.firstName}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                onLastNameChange(e.target.value.replace(/[^a-zA-Z\s]/g, ""));
                onFieldChange("lastName");
              }}
              autoComplete="family-name"
              autoCapitalize="words"
              className={`w-full pl-10 pr-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary font-medium ${
                fieldErrors.lastName ? "border-red-400 bg-red-50/30" : "border-primary/10"
              }`}
            />
          </div>
          {fieldErrors.lastName && (
            <p className="text-[10px] text-red-500 font-bold">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              onEmailChange(e.target.value);
              onFieldChange("email");
            }}
            autoComplete="email"
            inputMode="email"
            className={`w-full pl-10 pr-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary font-medium ${
              fieldErrors.email ? "border-red-400 bg-red-50/30" : "border-primary/10"
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p className="text-[10px] text-red-500 font-bold">{fieldErrors.email}</p>
        )}
      </div>
    </div>
  );
}