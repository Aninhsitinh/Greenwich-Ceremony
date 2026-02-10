<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 pb-24">
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: -2s"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: -4s"></div>
    </div>

    <!-- Premium Header -->
    <div class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div class="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 class="text-xl font-bold text-white">Complete Your Booking</h1>
            <p class="text-xs text-blue-300">Graduation Ceremony 2024</p>
          </div>
        </div>
        <img src="@/assets/images/2022-Greenwich-Eng.webp" alt="University of Greenwich" class="h-10 object-contain bg-white rounded-lg p-1" />
      </div>
    </div>

    <div class="relative z-10 p-4 max-w-5xl mx-auto">
      <!-- Step Indicator -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <template v-for="(step, index) in steps" :key="step.id">
          <div class="flex items-center gap-2">
            <div :class="[
              'w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500',
              currentStep > index ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-500/30' :
              currentStep === index ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110' :
              'bg-white/10 text-white/50'
            ]">
              <span v-if="currentStep > index" class="material-symbols-outlined">check</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span :class="['text-sm font-semibold hidden sm:block', currentStep >= index ? 'text-white' : 'text-white/40']">
              {{ step.label }}
            </span>
          </div>
          <div v-if="index < steps.length - 1" :class="['w-8 sm:w-16 h-1 rounded-full transition-all duration-500', currentStep > index ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-white/20']"></div>
        </template>
      </div>

      <!-- Step 1: Service Selection -->
      <Transition name="slide-fade" mode="out-in">
        <div v-if="currentStep === 0" key="services" class="space-y-6">
          <!-- Available Packages -->
          <div class="glass-card p-6">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span class="material-symbols-outlined text-white">shopping_bag</span>
              </div>
              Select Your Packages
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Gown Rental -->
              <div 
                @click="toggleService('gown')"
                :class="[
                  'relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden',
                  selectedServices.gown 
                    ? 'border-purple-500 bg-purple-500/20 scale-[1.02]' 
                    : 'border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                ]"
              >
                <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div class="relative z-10 flex items-start gap-4">
                  <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-all', selectedServices.gown ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-white/10']">
                    <span class="material-symbols-outlined text-3xl text-white">checkroom</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-white mb-1">Graduation Gown</h3>
                    <p class="text-sm text-white/60 mb-3">Cap, gown, hood & tassel included</p>
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">500,000₫</span>
                      <div :class="['w-8 h-8 rounded-full flex items-center justify-center transition-all', selectedServices.gown ? 'bg-purple-500' : 'bg-white/20']">
                        <span class="material-symbols-outlined text-white text-sm">{{ selectedServices.gown ? 'check' : 'add' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Photo Package -->
              <div 
                @click="toggleService('photo')"
                :class="[
                  'relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden',
                  selectedServices.photo 
                    ? 'border-amber-500 bg-amber-500/20 scale-[1.02]' 
                    : 'border-white/20 bg-white/5 hover:border-amber-500/50 hover:bg-white/10'
                ]"
              >
                <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div class="relative z-10 flex items-start gap-4">
                  <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-all', selectedServices.photo ? 'bg-gradient-to-br from-amber-400 to-orange-600' : 'bg-white/10']">
                    <span class="material-symbols-outlined text-3xl text-white">photo_camera</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-white mb-1">Photo Package</h3>
                    <p class="text-sm text-white/60 mb-3">20 professional photos + digital copies</p>
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">300,000₫</span>
                      <div :class="['w-8 h-8 rounded-full flex items-center justify-center transition-all', selectedServices.photo ? 'bg-amber-500' : 'bg-white/20']">
                        <span class="material-symbols-outlined text-white text-sm">{{ selectedServices.photo ? 'check' : 'add' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Video Recording -->
              <div 
                @click="toggleService('video')"
                :class="[
                  'relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden',
                  selectedServices.video 
                    ? 'border-rose-500 bg-rose-500/20 scale-[1.02]' 
                    : 'border-white/20 bg-white/5 hover:border-rose-500/50 hover:bg-white/10'
                ]"
              >
                <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div class="relative z-10 flex items-start gap-4">
                  <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-all', selectedServices.video ? 'bg-gradient-to-br from-rose-500 to-red-600' : 'bg-white/10']">
                    <span class="material-symbols-outlined text-3xl text-white">videocam</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-white mb-1">Video Recording</h3>
                    <p class="text-sm text-white/60 mb-3">HD video of your ceremony moment</p>
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">200,000₫</span>
                      <div :class="['w-8 h-8 rounded-full flex items-center justify-center transition-all', selectedServices.video ? 'bg-rose-500' : 'bg-white/20']">
                        <span class="material-symbols-outlined text-white text-sm">{{ selectedServices.video ? 'check' : 'add' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Certificate Frame -->
              <div 
                @click="toggleService('frame')"
                :class="[
                  'relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden',
                  selectedServices.frame 
                    ? 'border-cyan-500 bg-cyan-500/20 scale-[1.02]' 
                    : 'border-white/20 bg-white/5 hover:border-cyan-500/50 hover:bg-white/10'
                ]"
              >
                <div class="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div class="relative z-10 flex items-start gap-4">
                  <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-all', selectedServices.frame ? 'bg-gradient-to-br from-cyan-400 to-blue-600' : 'bg-white/10']">
                    <span class="material-symbols-outlined text-3xl text-white">frame_person</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-white mb-1">Certificate Frame</h3>
                    <p class="text-sm text-white/60 mb-3">Premium wooden frame for diploma</p>
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">150,000₫</span>
                      <div :class="['w-8 h-8 rounded-full flex items-center justify-center transition-all', selectedServices.frame ? 'bg-cyan-500' : 'bg-white/20']">
                        <span class="material-symbols-outlined text-white text-sm">{{ selectedServices.frame ? 'check' : 'add' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Guest Seats Selection -->
          <div class="glass-card p-6">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-white">event_seat</span>
              </div>
              Guest Seats
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- VIP Seats -->
              <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <span class="material-symbols-outlined text-white text-2xl">star</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-white">VIP Seats</h3>
                      <p class="text-sm text-amber-300">200,000₫ each</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <button @click="vipSeats > 0 && vipSeats--" :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', vipSeats > 0 ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed']">
                      <span class="material-symbols-outlined">remove</span>
                    </button>
                    <span class="text-3xl font-black text-white w-12 text-center">{{ vipSeats }}</span>
                    <button @click="vipSeats < 4 && vipSeats++" :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', vipSeats < 4 ? 'bg-amber-500 hover:bg-amber-400 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed']">
                      <span class="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <span class="text-xl font-bold text-amber-400">{{ formatCurrency(vipSeats * 200000) }}</span>
                </div>
              </div>

              <!-- Regular Seats -->
              <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <span class="material-symbols-outlined text-white text-2xl">event_seat</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-white">Regular Seats</h3>
                      <p class="text-sm text-blue-300">100,000₫ each</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <button @click="regularSeats > 0 && regularSeats--" :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', regularSeats > 0 ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed']">
                      <span class="material-symbols-outlined">remove</span>
                    </button>
                    <span class="text-3xl font-black text-white w-12 text-center">{{ regularSeats }}</span>
                    <button @click="regularSeats < 4 && regularSeats++" :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', regularSeats < 4 ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed']">
                      <span class="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <span class="text-xl font-bold text-blue-400">{{ formatCurrency(regularSeats * 100000) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Payment -->
        <div v-else-if="currentStep === 1" key="payment" class="space-y-6">
          <!-- Order Summary -->
          <div class="glass-card p-6">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-white">receipt_long</span>
              </div>
              Order Summary
            </h2>

            <div class="space-y-3">
              <div v-for="item in orderItems" :key="item.name" class="flex items-center justify-between py-3 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', item.bgClass]">
                    <span class="material-symbols-outlined text-white">{{ item.icon }}</span>
                  </div>
                  <span class="text-white font-medium">{{ item.name }}</span>
                </div>
                <span class="text-white font-bold">{{ formatCurrency(item.price) }}</span>
              </div>

              <div class="flex items-center justify-between pt-4 mt-2">
                <span class="text-lg font-bold text-white">Total Amount</span>
                <span class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">{{ formatCurrency(totalAmount) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="glass-card p-6">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-white">payments</span>
              </div>
              Payment Method
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                v-for="method in paymentMethods" 
                :key="method.id"
                @click="selectedPaymentMethod = method.id"
                :class="[
                  'relative p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden group',
                  selectedPaymentMethod === method.id 
                    ? 'border-blue-500 bg-blue-500/20 scale-[1.02]' 
                    : 'border-white/20 bg-white/5 hover:border-blue-500/50'
                ]"
              >
                <div class="flex flex-col items-center gap-3">
                  <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center transition-all', selectedPaymentMethod === method.id ? method.activeBg : 'bg-white/10']">
                    <span class="material-symbols-outlined text-3xl text-white">{{ method.icon }}</span>
                  </div>
                  <div class="text-center">
                    <p class="font-bold text-white">{{ method.name }}</p>
                    <p class="text-xs text-white/60">{{ method.desc }}</p>
                  </div>
                </div>
                <div v-if="selectedPaymentMethod === method.id" class="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-sm">check</span>
                </div>
              </button>
            </div>

            <!-- QR Payment Display -->
            <div v-if="selectedPaymentMethod === 'qr'" class="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p class="text-white/60 mb-4">Scan with VNPay / MoMo / ZaloPay</p>
              <div class="inline-block p-4 bg-white rounded-2xl">
                <img :src="qrCodeUrl" alt="Payment QR" class="w-48 h-48" />
              </div>
            </div>

            <!-- Card Payment Form -->
            <div v-if="selectedPaymentMethod === 'card'" class="mt-6 space-y-4">
              <div>
                <label class="block text-sm font-semibold text-white/80 mb-2">Card Number</label>
                <input v-model="cardNumber" type="text" placeholder="4242 4242 4242 4242" class="w-full h-14 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-white/80 mb-2">Expiry</label>
                  <input v-model="cardExpiry" type="text" placeholder="MM/YY" class="w-full h-14 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-white/80 mb-2">CVV</label>
                  <input v-model="cardCvv" type="text" placeholder="123" class="w-full h-14 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Success with QR Ticket -->
        <div v-else-if="currentStep === 2" key="success" class="space-y-6">
          <div class="glass-card p-8 text-center">
            <!-- Success Animation -->
            <div class="relative inline-block mb-6">
              <div class="absolute inset-0 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div class="relative w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                <span class="material-symbols-outlined text-6xl text-white animate-bounce">check</span>
              </div>
            </div>

            <h2 class="text-3xl font-black text-white mb-2">Payment Successful!</h2>
            <p class="text-white/60 mb-8">Your graduation booking has been confirmed</p>

            <!-- Transaction Details -->
            <div class="bg-white/5 rounded-2xl p-4 mb-8 max-w-md mx-auto">
              <div class="flex justify-between py-2 border-b border-white/10">
                <span class="text-white/60">Transaction ID</span>
                <span class="font-mono font-bold text-white">{{ transactionId }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-white/10">
                <span class="text-white/60">Amount Paid</span>
                <span class="font-bold text-green-400">{{ formatCurrency(totalAmount) }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-white/60">Status</span>
                <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">Completed</span>
              </div>
            </div>

            <!-- QR Ticket -->
            <div class="relative max-w-md mx-auto">
              <div class="absolute -inset-4 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl"></div>
              <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-white/10 overflow-hidden">
                <!-- Ticket Header -->
                <div class="text-center mb-6">
                  <img src="@/assets/images/2022-Greenwich-Eng.webp" alt="Logo" class="h-12 mx-auto mb-3 bg-white rounded-lg p-1" />
                  <h3 class="text-xl font-bold text-white">Graduation Ceremony 2024</h3>
                  <p class="text-sm text-white/60">FPT Greenwich Vietnam</p>
                </div>

                <!-- Dashed Separator -->
                <div class="flex items-center my-4">
                  <div class="flex-1 border-t-2 border-dashed border-white/20"></div>
                  <span class="px-3 text-white/40 text-xs">SCAN TO ENTER</span>
                  <div class="flex-1 border-t-2 border-dashed border-white/20"></div>
                </div>

                <!-- QR Code -->
                <div class="flex justify-center mb-6">
                  <div class="p-4 bg-white rounded-2xl shadow-xl">
                    <img :src="ticketQrUrl" alt="Ticket QR Code" class="w-40 h-40" />
                  </div>
                </div>

                <!-- Ticket Info -->
                <div class="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p class="text-xs text-white/40 uppercase">Student Name</p>
                    <p class="font-bold text-white">{{ userName }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-white/40 uppercase">Student ID</p>
                    <p class="font-bold text-white">{{ studentId }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-white/40 uppercase">Date</p>
                    <p class="font-bold text-white">June 15, 2024</p>
                  </div>
                  <div>
                    <p class="text-xs text-white/40 uppercase">Time</p>
                    <p class="font-bold text-white">9:00 AM</p>
                  </div>
                </div>

                <!-- Services Included -->
                <div class="mt-6 pt-4 border-t border-white/10">
                  <p class="text-xs text-white/40 uppercase mb-2">Services Included</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="item in orderItems" :key="item.name" class="px-3 py-1 bg-white/10 rounded-full text-xs text-white font-medium">
                      {{ item.shortName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
              <button @click="downloadTicket" class="h-14 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">download</span>
                Download
              </button>
              <button @click="$router.push('/student')" class="h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">home</span>
                Go Home
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Bottom Action Bar -->
      <div v-if="currentStep < 2" class="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p class="text-sm text-white/60">Total Amount</p>
            <p class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">{{ formatCurrency(totalAmount) }}</p>
          </div>
          <div class="flex gap-3">
            <button 
              v-if="currentStep > 0"
              @click="currentStep--" 
              class="h-14 px-6 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <span class="material-symbols-outlined">arrow_back</span>
              Back
            </button>
            <button 
              @click="nextStep"
              :disabled="!canProceed || isProcessing"
              class="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <div v-if="isProcessing" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <template v-else>
                <span>{{ currentStep === 0 ? 'Continue to Payment' : 'Pay Now' }}</span>
                <span class="material-symbols-outlined">{{ currentStep === 0 ? 'arrow_forward' : 'lock' }}</span>
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();

const currentStep = ref(0);
const isProcessing = ref(false);
const transactionId = ref('');

const steps = [
  { id: 1, label: 'Select Services' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Confirmation' }
];

// Services
const selectedServices = ref({
  gown: true,
  photo: false,
  video: false,
  frame: false
});

const vipSeats = ref(0);
const regularSeats = ref(0);

// Payment
const selectedPaymentMethod = ref('qr');
const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');

const paymentMethods = [
  { id: 'qr', name: 'QR Payment', desc: 'VNPay, MoMo, ZaloPay', icon: 'qr_code_2', activeBg: 'bg-gradient-to-br from-purple-500 to-pink-600' },
  { id: 'card', name: 'Bank Card', desc: 'Visa, Mastercard', icon: 'credit_card', activeBg: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
  { id: 'cash', name: 'Cash', desc: 'Pay at office', icon: 'payments', activeBg: 'bg-gradient-to-br from-green-500 to-emerald-600' }
];

const servicePrices = {
  gown: { price: 500000, name: 'Graduation Gown', shortName: 'Gown', icon: 'checkroom', bgClass: 'bg-gradient-to-br from-purple-500 to-pink-600' },
  photo: { price: 300000, name: 'Photo Package', shortName: 'Photo', icon: 'photo_camera', bgClass: 'bg-gradient-to-br from-amber-400 to-orange-500' },
  video: { price: 200000, name: 'Video Recording', shortName: 'Video', icon: 'videocam', bgClass: 'bg-gradient-to-br from-rose-500 to-red-600' },
  frame: { price: 150000, name: 'Certificate Frame', shortName: 'Frame', icon: 'frame_person', bgClass: 'bg-gradient-to-br from-cyan-400 to-blue-500' }
};

const toggleService = (service) => {
  selectedServices.value[service] = !selectedServices.value[service];
};

const orderItems = computed(() => {
  const items = [];
  
  Object.keys(selectedServices.value).forEach(key => {
    if (selectedServices.value[key]) {
      const service = servicePrices[key];
      items.push({
        name: service.name,
        shortName: service.shortName,
        price: service.price,
        icon: service.icon,
        bgClass: service.bgClass
      });
    }
  });
  
  if (vipSeats.value > 0) {
    items.push({
      name: `VIP Seats x${vipSeats.value}`,
      shortName: `VIP x${vipSeats.value}`,
      price: vipSeats.value * 200000,
      icon: 'star',
      bgClass: 'bg-gradient-to-br from-amber-400 to-orange-500'
    });
  }
  
  if (regularSeats.value > 0) {
    items.push({
      name: `Regular Seats x${regularSeats.value}`,
      shortName: `Seats x${regularSeats.value}`,
      price: regularSeats.value * 100000,
      icon: 'event_seat',
      bgClass: 'bg-gradient-to-br from-blue-400 to-indigo-500'
    });
  }
  
  return items;
});

const totalAmount = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.price, 0);
});

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return totalAmount.value > 0;
  }
  if (currentStep.value === 1) {
    return selectedPaymentMethod.value !== null;
  }
  return true;
});

const userName = computed(() => authStore.user?.fullName || 'Student');
const studentId = computed(() => authStore.user?.studentId || 'GCS000000');

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAY_${totalAmount.value}_${Date.now()}`;
});

const ticketQrUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET_${transactionId.value}_${studentId.value}`;
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const nextStep = async () => {
  if (currentStep.value === 0) {
    currentStep.value = 1;
  } else if (currentStep.value === 1) {
    await processPayment();
  }
};

const processPayment = async () => {
  isProcessing.value = true;
  
  try {
    // Generate transaction ID
    transactionId.value = 'TXN' + Date.now().toString().slice(-10);
    
    // Prepare payment data
    const paymentData = {
      amount: totalAmount.value,
      paymentType: 'graduation_package',
      paymentMethod: selectedPaymentMethod.value,
      transactionId: transactionId.value,
      status: 'completed',
      items: orderItems.value.map(item => ({
        name: item.name,
        price: item.price
      }))
    };
    
    // Save to database
    try {
      await api.post('/payments', paymentData);
    } catch (err) {
      console.log('Payment record creation (demo mode)');
    }
    
    // Create seat bookings if any
    if (vipSeats.value > 0 || regularSeats.value > 0) {
      try {
        // Create booking for VIP seats
        for (let i = 0; i < vipSeats.value; i++) {
          await api.post('/seats/book', {
            seatNumber: `VIP-${Date.now()}-${i}`,
            seatType: 'guest',
            guestName: `Guest ${i + 1}`,
            status: 'confirmed'
          });
        }
        
        // Create booking for regular seats
        for (let i = 0; i < regularSeats.value; i++) {
          await api.post('/seats/book', {
            seatNumber: `REG-${Date.now()}-${i}`,
            seatType: 'guest',
            guestName: `Guest ${vipSeats.value + i + 1}`,
            status: 'confirmed'
          });
        }
      } catch (err) {
        console.log('Seat booking (demo mode)');
      }
    }
    
    // Generate ticket
    try {
      await api.post('/tickets/generate');
    } catch (err) {
      console.log('Ticket generation (demo mode)');
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Move to success step
    currentStep.value = 2;
    
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  } finally {
    isProcessing.value = false;
  }
};

const downloadTicket = () => {
  // Create download link for ticket
  const ticketData = {
    transactionId: transactionId.value,
    studentName: userName.value,
    studentId: studentId.value,
    services: orderItems.value,
    totalAmount: totalAmount.value
  };
  
  const blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ticket_${transactionId.value}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
