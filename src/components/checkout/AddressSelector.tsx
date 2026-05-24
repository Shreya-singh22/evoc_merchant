"use client";

import React, { useState } from "react";
import {
  Home,
  Briefcase,
  MapPin,
  Plus,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { addressSchema } from "@/lib/validation";
import { createAddress, getUserByPhone, getOrCreateUser } from "@/actions";
import { AddressData } from "@/actions/user-actions";

interface AddressSelectorProps {
  userId: string;
  phone: string;
  addresses: AddressData[];
  selectedAddress: AddressData | null;
  onAddressSelect: (address: AddressData) => void;
  onUserUpdate: (user: any) => void;
}

const ADDRESS_TYPES = ["HOME", "WORK", "OTHER"] as const;

export default function AddressSelector({
  userId,
  phone,
  addresses,
  selectedAddress,
  onAddressSelect,
  onUserUpdate,
}: AddressSelectorProps) {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [newAddress, setNewAddress] = useState({
    type: "HOME" as typeof ADDRESS_TYPES[number],
    flatHouse: "",
    areaStreet: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: true,
  });

  const handleSaveAddress = async () => {
    setError(null);
    setFieldErrors({});

    const result = addressSchema.safeParse(newAddress);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const createResult = await createAddress({
        userId,
        ...newAddress,
      });

      if (createResult.success) {
        const userResult = await getUserByPhone(phone);
        if (userResult.success && userResult.data) {
          onUserUpdate(userResult.data);
          if (createResult.data) {
            onAddressSelect(createResult.data);
          }
        }
        setShowForm(false);
        setNewAddress({
          type: "HOME",
          flatHouse: "",
          areaStreet: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
          isDefault: true,
        });
      } else if (createResult.message === "This address already exists") {
        setError("This address already exists");
      } else {
        throw new Error(createResult.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "HOME":
        return <Home size={14} className="text-primary" />;
      case "WORK":
        return <Briefcase size={14} className="text-primary" />;
      default:
        return <MapPin size={14} className="text-primary" />;
    }
  };

  if (showForm) {
    return (
      <div className="space-y-4 border border-primary/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-charcoal/60">
            Add New Address
          </h3>
          <button
            onClick={() => setShowForm(false)}
            className="text-charcoal/40 hover:text-charcoal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2">
          {ADDRESS_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setNewAddress({ ...newAddress, type })}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                newAddress.type === type
                  ? "border-primary bg-primary text-white"
                  : "border-primary/20 text-charcoal/60"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <input
          placeholder="House/Flat/Building"
          value={newAddress.flatHouse}
          onChange={(e) => {
            setNewAddress({ ...newAddress, flatHouse: e.target.value });
            setFieldErrors((prev) => ({ ...prev, flatHouse: "" }));
          }}
          className={`w-full px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary font-medium ${
            fieldErrors.flatHouse ? "border-red-400 bg-red-50/30" : "border-primary/10"
          }`}
        />
        {fieldErrors.flatHouse && (
          <p className="text-[10px] text-red-500 font-bold -mt-2">{fieldErrors.flatHouse}</p>
        )}

        <input
          placeholder="Street/Area/Landmark"
          value={newAddress.areaStreet}
          onChange={(e) => {
            setNewAddress({ ...newAddress, areaStreet: e.target.value });
            setFieldErrors((prev) => ({ ...prev, areaStreet: "" }));
          }}
          className={`w-full px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary font-medium ${
            fieldErrors.areaStreet ? "border-red-400 bg-red-50/30" : "border-primary/10"
          }`}
        />
        {fieldErrors.areaStreet && (
          <p className="text-[10px] text-red-500 font-bold -mt-2">{fieldErrors.areaStreet}</p>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <input
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => {
                setNewAddress({ ...newAddress, city: e.target.value.replace(/[^a-zA-Z\s]/g, "") });
                setFieldErrors((prev) => ({ ...prev, city: "" }));
              }}
              className={`px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary font-medium ${
                fieldErrors.city ? "border-red-400 bg-red-50/30" : "border-primary/10"
              }`}
            />
            {fieldErrors.city && (
              <p className="text-[10px] text-red-500 font-bold">{fieldErrors.city}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => {
                setNewAddress({ ...newAddress, state: e.target.value.replace(/[^a-zA-Z\s]/g, "") });
                setFieldErrors((prev) => ({ ...prev, state: "" }));
              }}
              className={`px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary font-medium ${
                fieldErrors.state ? "border-red-400 bg-red-50/30" : "border-primary/10"
              }`}
            />
            {fieldErrors.state && (
              <p className="text-[10px] text-red-500 font-bold">{fieldErrors.state}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              placeholder="PIN Code"
              value={newAddress.pincode}
              onChange={(e) => {
                setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) });
                setFieldErrors((prev) => ({ ...prev, pincode: "" }));
              }}
              maxLength={6}
              inputMode="numeric"
              className={`px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary font-medium ${
                fieldErrors.pincode ? "border-red-400 bg-red-50/30" : "border-primary/10"
              }`}
            />
            {fieldErrors.pincode && (
              <p className="text-[10px] text-red-500 font-bold">{fieldErrors.pincode}</p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-charcoal/60">
          <input
            type="checkbox"
            checked={newAddress.isDefault}
            onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
            className="w-4 h-4 rounded border-primary/20"
          />
          Set as default address
        </label>

        {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

        <button
          onClick={handleSaveAddress}
          disabled={isLoading}
          className="w-full bg-primary text-white font-black py-3 rounded-xl disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Save Address"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-charcoal/60">
          Delivery Address
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 text-xs font-black text-primary"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-primary/20 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-all"
        >
          <Plus size={16} /> Add Delivery Address
        </button>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => onAddressSelect(addr)}
              className={`flex flex-col p-4 rounded-xl border-2 text-left transition-all ${
                selectedAddress?.id === addr.id
                  ? "border-primary bg-primary/5"
                  : "border-primary/10 hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {getAddressIcon(addr.type)}
                <span className="text-[10px] font-black uppercase text-primary">
                  {addr.type}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] text-charcoal/40">Default</span>
                )}
                {selectedAddress?.id === addr.id && (
                  <CheckCircle2 size={14} className="text-primary ml-auto" />
                )}
              </div>
              <p className="text-sm font-bold text-charcoal line-clamp-1">
                {addr.flatHouse}
              </p>
              <p className="text-xs text-charcoal/60 line-clamp-2">
                {addr.areaStreet}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}