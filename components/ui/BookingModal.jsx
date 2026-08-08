'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, ArrowRight, Circle, Target, Zap, Dumbbell } from 'lucide-react';

const FACILITIES = {
  futsal: {
    name: 'Futsal',
    color: '#00C864',
    bgGradient: 'from-[#0A2E1A] to-[#0D0D0E]',
    accentBg: 'bg-[#00C864]/10',
    accentBorder: 'border-[#00C864]/30',
    accentText: 'text-[#00C864]',
    buttonBg: 'bg-[#00C864] hover:bg-[#00B858]',
    buttonText: 'text-[#0D0D0E]',
    Icon: Circle,
    description: 'Professional futsal courts',
    features: ['Full court', 'LED lighting', 'Quality flooring', 'Equipment provided'],
  },
  basketball: {
    name: 'Basketball',
    color: '#FF5500',
    bgGradient: 'from-[#3A1200] to-[#0D0D0E]',
    accentBg: 'bg-[#FF5500]/10',
    accentBorder: 'border-[#FF5500]/30',
    accentText: 'text-[#FF5500]',
    buttonBg: 'bg-[#FF5500] hover:bg-[#E64D00]',
    buttonText: 'text-[#0D0D0E]',
    Icon: Target,
    description: 'Full-size basketball courts',
    features: ['Full court', 'Regulation hoops', 'Scoreboards', 'Team facilities'],
  },
  badminton: {
    name: 'Badminton',
    color: '#0091D5',
    bgGradient: 'from-[#002840] to-[#0D0D0E]',
    accentBg: 'bg-[#0091D5]/10',
    accentBorder: 'border-[#0091D5]/30',
    accentText: 'text-[#0091D5]',
    buttonBg: 'bg-[#0091D5] hover:bg-[#007BB8]',
    buttonText: 'text-[#0D0D0E]',
    Icon: Zap,
    description: 'Indoor badminton courts',
    features: ['Multiple courts', 'Net equipment', 'Proper lighting', 'Racket rental'],
  },
  gym: {
    name: 'Gym',
    color: '#B91C1C',
    bgGradient: 'from-[#3A0808] to-[#0D0D0E]',
    accentBg: 'bg-[#B91C1C]/10',
    accentBorder: 'border-[#B91C1C]/30',
    accentText: 'text-[#B91C1C]',
    buttonBg: 'bg-[#B91C1C] hover:bg-[#991B1B]',
    buttonText: 'text-[#F4F1EA]',
    Icon: Dumbbell,
    description: 'Full equipment fitness center',
    features: ['Free weights', 'Cardio machines', 'Power racks', 'Personal training'],
  },
};

export default function BookingModal({ isOpen, onClose, initialFacility = 'futsal' }) {
  const [selectedFacility, setSelectedFacility] = useState(initialFacility);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    duration: '1',
    guests: '1',
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedFacility(initialFacility);
      setShowComingSoon(false);
    }
  }, [isOpen, initialFacility]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const facility = FACILITIES[selectedFacility];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowComingSoon(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (showComingSoon) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-[#0D0D0E] border border-[#1A1D1C] rounded-xl max-w-sm w-full shadow-2xl">
          {/* macOS Window Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF3B30] transition-colors"
              aria-label="Close"
            />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>

          <div className="text-center p-8 pt-12">
            <div className="mb-4 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#1A1D1C] flex items-center justify-center">
                <Clock size={28} className="text-[#85878A]" />
              </div>
            </div>
            <h3 className="font-humane font-bold text-xl text-[#F4F4F0] mb-2">
              Coming Soon
            </h3>
            <p className="text-[#85878A] text-xs leading-relaxed mb-6">
              Our online booking system is currently under development. Please contact us directly to book your slot.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#1A1D1C] hover:bg-[#2A2D2C] text-[#F4F4F0] py-2.5 rounded-lg font-stedelijk text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal - Smaller, more compact */}
      <div className="relative bg-[#0D0D0E] border border-[#1A1D1C] rounded-xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* macOS Window Controls + Header Combined */}
        <div className={`sticky top-0 z-10 bg-gradient-to-br ${facility.bgGradient} border-b border-[#1A1D1C] px-5 py-4`}>
          {/* macOS Window Controls */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF3B30] transition-colors"
              aria-label="Close"
            />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>

          {/* Header Content */}
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg ${facility.accentBg} border ${facility.accentBorder} flex items-center justify-center`}>
              <facility.Icon size={18} className={facility.accentText} />
            </div>
            <div>
              <h2 className="font-humane font-bold text-lg text-[#F4F4F0]">
                Book {facility.name}
              </h2>
              <p className="text-[#85878A] text-[10px]">{facility.description}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Facility Selector */}
          <div className="p-4 border-b border-[#1A1D1C]">
            <label className="block text-[#85878A] text-[10px] font-mono uppercase tracking-wider mb-2">
              Select Facility
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.entries(FACILITIES).map(([key, fac]) => (
                <button
                  key={key}
                  onClick={() => setSelectedFacility(key)}
                  className={`p-2 rounded-md border transition-all ${
                    selectedFacility === key
                      ? `${fac.accentBg} ${fac.accentBorder} ${fac.accentText}`
                      : 'bg-[#1A1D1C]/50 border-[#1A1D1C] text-[#85878A] hover:bg-[#1A1D1C]'
                  }`}
                >
                  <div className="flex items-center justify-center mb-0.5">
                    <fac.Icon size={16} />
                  </div>
                  <div className="text-[9px] font-stedelijk">{fac.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Personal Info */}
            <div className="space-y-3">
              <div>
                <label className="block text-[#85878A] text-[10px] font-mono uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#1A1D1C] border border-[#2A2D2C] rounded-lg px-3 py-2 text-[#F4F4F0] text-xs focus:outline-none focus:border-[#00C864]/50 transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#85878A] text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1A1D1C] border border-[#2A2D2C] rounded-lg px-3 py-2 text-[#F4F4F0] text-xs focus:outline-none focus:border-[#00C864]/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[#85878A] text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1A1D1C] border border-[#2A2D2C] rounded-lg px-3 py-2 text-[#F4F4F0] text-xs focus:outline-none focus:border-[#00C864]/50 transition-colors"
                    placeholder="+977 XXX"
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="flex items-center gap-1.5 text-[#85878A] text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    <Calendar size={12} />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#1A1D1C] border border-[#2A2D2C] rounded-lg px-3 py-2 text-[#F4F4F0] text-xs focus:outline-none focus:border-[#00C864]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[#85878A] text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    <Clock size={12} />
                    Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1A1D1C] border border-[#2A2D2C] rounded-lg px-3 py-2 text-[#F4F4F0] text-xs focus:outline-none focus:border-[#00C864]/50 transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="06:00">6:00 AM</option>
                    <option value="07:00">7:00 AM</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#85878A] text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1D1C] border border-[#2A2D2C] rounded-lg px-3 py-2 text-[#F4F4F0] text-xs focus:outline-none focus:border-[#00C864]/50 transition-colors"
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[#85878A] text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    <Users size={12} />
                    Guests
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1D1C] border border-[#2A2D2C] rounded-lg px-3 py-2 text-[#F4F4F0] text-xs focus:outline-none focus:border-[#00C864]/50 transition-colors"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Features - More Compact */}
            <div className={`${facility.accentBg} border ${facility.accentBorder} rounded-lg p-3`}>
              <h4 className="text-[#F4F4F0] text-[10px] font-stedelijk uppercase mb-1.5">Included:</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {facility.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[#85878A] text-[10px]">
                    <div className={`w-1 h-1 rounded-full ${facility.accentText.replace('text-', 'bg-')}`} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`group w-full ${facility.buttonBg} ${facility.buttonText} py-3 rounded-lg font-stedelijk text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg flex items-center justify-center gap-2`}
            >
              <span>Book {facility.name} Now</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
