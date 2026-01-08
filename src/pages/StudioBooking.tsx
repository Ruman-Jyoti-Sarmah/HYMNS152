import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Users, Mic, Headphones, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { format, addDays, isSameDay, isBefore, startOfDay } from 'date-fns';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  booked: boolean;
  selected: boolean;
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  purpose: string;
}

const StudioBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingStep, setBookingStep] = useState<'date' | 'time' | 'details' | 'confirm' | 'success'>('date');
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    purpose: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Stable reference for today's date to prevent calendar instability
  const today = useMemo(() => startOfDay(new Date()), []);

  // Generate time slots (9 AM to 10 PM, hourly)
  useEffect(() => {
    if (selectedDate) {
      const slots: TimeSlot[] = [];
      for (let hour = 9; hour <= 22; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        // Simulate some booked slots (for demo purposes)
        const isBooked = Math.random() > 0.7; // 30% chance of being booked
        slots.push({
          id: `${format(selectedDate, 'yyyy-MM-dd')}-${hour}`,
          time: timeString,
          available: !isBooked,
          booked: isBooked,
          selected: false
        });
      }
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  const handleTimeSlotSelect = (slotId: string) => {
    setTimeSlots(prev => prev.map(slot =>
      slot.id === slotId
        ? { ...slot, selected: !slot.selected }
        : { ...slot, selected: false }
    ));
  };

  const selectedSlots = timeSlots.filter(slot => slot.selected);
  const totalHours = selectedSlots.length;
  const pricePerHour = 150; // ₹150/hour
  const totalPrice = totalHours * pricePerHour;

  const handleNext = () => {
    if (bookingStep === 'date' && !selectedDate) {
      toast({
        title: "Select a date",
        description: "Please select a date for your booking",
        variant: "destructive"
      });
      return;
    }

    if (bookingStep === 'time' && selectedSlots.length === 0) {
      toast({
        title: "Select time slots",
        description: "Please select at least one time slot",
        variant: "destructive"
      });
      return;
    }

    if (bookingStep === 'details') {
      if (!bookingData.name || !bookingData.email || !bookingData.phone) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    }

    if (bookingStep === 'confirm') {
      handleBookingSubmit();
      return;
    }

    const steps = ['date', 'time', 'details', 'confirm', 'success'];
    const currentIndex = steps.indexOf(bookingStep);
    if (currentIndex < steps.length - 1) {
      setBookingStep(steps[currentIndex + 1] as any);
    }
  };

  const handleBack = () => {
    const steps = ['date', 'time', 'details', 'confirm', 'success'];
    const currentIndex = steps.indexOf(bookingStep);
    if (currentIndex > 0) {
      setBookingStep(steps[currentIndex - 1] as any);
    }
  };

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Booking confirmed!",
      description: "Your studio time has been booked successfully. Check your email for confirmation details.",
    });

    setBookingStep('success');
    setIsSubmitting(false);
  };

  const studioDetails = {
    pricePerHour: 150,
    equipment: [
      'Neumann U87 Microphone',
      'Focusrite Scarlett Interface',
      'AKG K240 Headphones',
      'Yamaha HS8 Monitors',
      'Acoustic Treatment Panels'
    ],
    rules: [
      'Maximum 4 people per session',
      'No food or drinks in studio',
      '30-minute setup/cleanup time included',
      'Cancellation policy: 24 hours notice required',
      'Payment due at time of booking'
    ]
  };

  const renderDateSelection = () => {
    const currentMonth = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay()); // Start from Sunday

    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay())); // End on Saturday

    // Generate calendar days
    const calendarDays = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      calendarDays.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const handleDateClick = (date: Date) => {
      if (isBefore(date, today)) return;
      setSelectedDate(date);
    };

    const isSameDay = (date1: Date, date2: Date) => {
      return date1.getDate() === date2.getDate() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getFullYear() === date2.getFullYear();
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Select Date</h2>
          <p className="text-muted-foreground">Choose your preferred date for the studio session</p>
        </div>

        <div className="flex justify-center">
          <Card className="w-[450px] bg-card border-border">
            <CardContent className="p-6">
              {/* Month/Year Header */}
              <div className="flex items-center justify-center mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {monthNames[month]} {year}
                </h3>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {dayNames.map((day) => (
                  <div key={day} className="h-12 flex items-center justify-center text-base font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === month;
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, new Date());
                  const isDisabled = isBefore(date, today);
                  const isOutsideMonth = !isCurrentMonth;

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      disabled={isDisabled}
                      className={`
                        h-12 w-12 flex items-center justify-center text-base font-normal rounded-full transition-colors
                        ${isSelected
                          ? 'bg-primary text-primary-foreground hover:bg-primary'
                          : isToday && isCurrentMonth
                          ? 'bg-accent text-accent-foreground font-semibold'
                          : isDisabled || isOutsideMonth
                          ? 'text-muted-foreground opacity-50 cursor-not-allowed'
                          : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedDate && (
          <div className="text-center">
            <Badge variant="secondary" className="text-sm">
              Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  const renderTimeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Select Time Slots</h2>
        <p className="text-muted-foreground">Choose your preferred time slots (₹{pricePerHour}/hour)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {timeSlots.map((slot) => (
          <Button
            key={slot.id}
            variant={slot.selected ? "default" : slot.booked ? "secondary" : "outline"}
            className={`h-12 ${
              slot.booked
                ? 'opacity-50 cursor-not-allowed'
                : slot.selected
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-primary/10'
            }`}
            onClick={() => !slot.booked && handleTimeSlotSelect(slot.id)}
            disabled={slot.booked}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {slot.time}
            </div>
            {slot.booked && <X className="h-3 w-3 ml-1" />}
            {slot.selected && <Check className="h-3 w-3 ml-1" />}
          </Button>
        ))}
      </div>

      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-border rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded opacity-50"></div>
          <span>Booked</span>
        </div>
      </div>

      {selectedSlots.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Selected: {totalHours} hour{totalHours > 1 ? 's' : ''}</span>
              <span className="font-bold text-primary">₹{totalPrice}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Booking Details</h2>
        <p className="text-muted-foreground">Please provide your contact information</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={bookingData.name}
                onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={bookingData.phone}
                onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={bookingData.email}
              onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="purpose">Purpose of Session</Label>
            <Textarea
              id="purpose"
              value={bookingData.purpose}
              onChange={(e) => setBookingData(prev => ({ ...prev, purpose: e.target.value }))}
              placeholder="Describe what you'll be working on..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Confirm Booking</h2>
        <p className="text-muted-foreground">Please review your booking details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-black">Booking Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Date:</span>
              <p className="text-muted-foreground">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div>
              <span className="font-medium">Time Slots:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedSlots.map(slot => (
                  <Badge key={slot.id} variant="secondary">{slot.time}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">Duration:</span>
              <p className="text-muted-foreground">{totalHours} hour{totalHours > 1 ? 's' : ''}</p>
            </div>
            <div>
              <span className="font-medium">Total Price:</span>
              <p className="text-primary font-bold">₹{totalPrice}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Name:</span>
              <p className="text-muted-foreground">{bookingData.name}</p>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <p className="text-muted-foreground">{bookingData.email}</p>
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              <p className="text-muted-foreground">{bookingData.phone}</p>
            </div>
            {bookingData.purpose && (
              <div>
                <span className="font-medium">Purpose:</span>
                <p className="text-muted-foreground">{bookingData.purpose}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mic className="h-6 w-6 text-black" />
            <h3 className="text-lg font-semibold text-black">Studio Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-600">Price per hour:</span>
              <p className="text-muted-foreground">₹{studioDetails.pricePerHour}</p>
            </div>
            <div>
              <span className="font-medium text-green-600">Equipment:</span>
              <p className="text-muted-foreground">Professional recording gear included</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6 animate-bounce-in">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-black mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground text-lg">
          Your studio time has been successfully booked. We've sent a confirmation email with all the details.
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 space-y-4">
          <div className="text-left space-y-2">
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">{selectedDate && format(selectedDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium">{selectedSlots[0]?.time} - {selectedSlots[selectedSlots.length - 1]?.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">{totalHours} hours</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-primary">₹{totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          View My Bookings
        </Button>
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );

  const renderStudioInfo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Studio Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {studioDetails.equipment.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Studio Rules & Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {studioDetails.rules.map((rule, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                <span className="text-sm">{rule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/contact" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Contact
          </Link>
          <h1 className="text-4xl xl:text-5xl font-bold text-black mb-4">
            Book Studio Time
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reserve your professional recording session at HYMNS Studio
          </p>
        </div>

        {/* Progress Indicator */}
        {bookingStep !== 'success' && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {['date', 'time', 'details', 'confirm'].map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    bookingStep === step
                      ? 'bg-primary text-primary-foreground'
                      : ['date', 'time', 'details', 'confirm'].indexOf(bookingStep) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 ${
                      ['date', 'time', 'details', 'confirm'].indexOf(bookingStep) > index
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {bookingStep === 'date' && renderDateSelection()}
            {bookingStep === 'time' && renderTimeSelection()}
            {bookingStep === 'details' && renderDetailsForm()}
            {bookingStep === 'confirm' && renderConfirmation()}
            {bookingStep === 'success' && renderSuccess()}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            {renderStudioInfo()}
          </div>
        </div>

        {/* Navigation Buttons */}
        {bookingStep !== 'success' && (
          <div className="flex justify-center gap-4 mt-8">
            {bookingStep !== 'date' && (
              <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {bookingStep === 'confirm' ? (
                isSubmitting ? 'Confirming...' : 'Confirm Booking'
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioBooking;
