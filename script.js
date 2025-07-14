// Global Variables
let currentLanguage = 'ar';
let qrDataUrl = '';

// DOM Elements
const langBtn = document.getElementById('langBtn');
const printForm = document.getElementById('printForm');
const paperTypeSelect = document.getElementById('paperType');
const customPaperInput = document.getElementById('customPaper');
const deliveryInput = document.getElementById('delivery');
const distanceResult = document.getElementById('distanceResult');
const copiesInput = document.getElementById('copies');
const pagesInput = document.getElementById('pages');
const printTypeRadios = document.querySelectorAll('input[name="printType"]');
const extraNoteRadios = document.querySelectorAll('input[name="extraNote"]');
const customNotesTextarea = document.getElementById('customNotes');
const printPriceBox = document.getElementById('printPriceBox');
const deliveryPriceBox = document.getElementById('deliveryPriceBox');
const totalPriceBox = document.getElementById('totalPriceBox');
const sendBtn = document.getElementById('sendBtn');
const cancelBtn = document.getElementById('cancelBtn');
const popup = document.getElementById('popup');
const popupClose = document.getElementById('popupClose');
const qrSection = document.getElementById('qrSection');
const qrCanvas = document.getElementById('qrCanvas');
const downloadQRBtn = document.getElementById('downloadQR');
const shareQRBtn = document.getElementById('shareQR');

// Text Content for Both Languages
const texts = {
    ar: {
        title: 'برنت شوب',
        printType: 'نوع الطباعة:',
        colorPrint: 'طباعة ملونة',
        bwPrint: 'طباعة أسود وأبيض',
        copies: 'عدد النسخ:',
        pages: 'عدد الأوراق:',
        paperType: 'نوع الورق:',
        customSize: 'مقاس مخصص',
        delivery: 'عنوان التوصيل:',
        extraNotes: 'ملاحظات إضافية:',
        stapler: 'دباسة',
        spiralBinding: 'تكعيب حلزوني',
        wireBinding: 'تكعيب سلك',
        doubleSided: 'طباعة وش وظهر',
        otherNotes: 'ملاحظات أخرى',
        files: 'الملفات:',
        printTotal: 'إجمالي الطباعة:',
        deliveryFee: 'تكلفة التوصيل:',
        totalPrice: 'الإجمالي الكلي:',
        sendWhatsApp: 'إرسال عبر الواتساب',
        cancel: 'إلغاء',
        orderSent: 'تم إرسال الطلب بنجاح!',
        ok: 'حسناً',
        deliveryTime: 'يتم تجهيز طلبك خلال ساعتين بعد وصول رسالة تأكيد الدفع والطباعة.',
        qrCode: 'كود الاستجابة السريعة:',
        downloadQR: 'تحميل QR Code',
        share: 'مشاركة',
        scanCode: 'امسح الكود للحصول على تفاصيل الطلب',
        contactSoon: 'سيتم التواصل معك قريباً',
        calculating: 'جاري حساب المسافة...',
        locationError: 'تعذر تحديد الموقع. يرجى التحقق من العنوان.',
        distanceText: 'المسافة إلى العنوان:',
        deliveryFeeText: 'رسوم التوصيل:',
        enterCustomSize: 'أدخل المقاس المخصص',
        enterDeliveryAddress: 'أدخل عنوان التوصيل',
        enterNotes: 'أدخل ملاحظاتك',
        enterCopies: 'أدخل عدد النسخ',
        enterPages: 'أدخل عدد الأوراق',
        pricesSummary: 'ملخص الأسعار'
    },
    en: {
        title: 'Print Shop',
        printType: 'Print Type:',
        colorPrint: 'Color Print',
        bwPrint: 'Black & White Print',
        copies: 'Copies:',
        pages: 'Pages:',
        paperType: 'Paper Type:',
        customSize: 'Custom Size',
        delivery: 'Delivery Address:',
        extraNotes: 'Additional Notes:',
        stapler: 'Stapler',
        spiralBinding: 'Spiral Binding',
        wireBinding: 'Wire Binding',
        doubleSided: 'Double-sided print',
        otherNotes: 'Other notes',
        files: 'Files:',
        printTotal: 'Print Total:',
        deliveryFee: 'Delivery Fee:',
        totalPrice: 'Total Price:',
        sendWhatsApp: 'Send via WhatsApp',
        cancel: 'Cancel',
        orderSent: 'Order sent successfully!',
        ok: 'OK',
        deliveryTime: 'Your order will be ready within 2 hours after payment and print confirmation.',
        qrCode: 'QR Code:',
        downloadQR: 'Download QR Code',
        share: 'Share',
        scanCode: 'Scan to get order details',
        contactSoon: 'We will contact you soon',
        calculating: 'Calculating distance...',
        locationError: 'Unable to determine location. Please check the address.',
        distanceText: 'Distance to address:',
        deliveryFeeText: 'Delivery fee:',
        enterCustomSize: 'Enter custom size',
        enterDeliveryAddress: 'Enter delivery address',
        enterNotes: 'Enter your notes',
        enterCopies: 'Enter number of copies',
        enterPages: 'Enter number of pages',
        pricesSummary: 'Price Summary'
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updatePrices();
});

// Event Listeners
function initializeEventListeners() {
    // Language toggle
    langBtn.addEventListener('click', toggleLanguage);
    
    // Paper type change
    paperTypeSelect.addEventListener('change', handlePaperTypeChange);
    
    // Price calculation
    copiesInput.addEventListener('input', updatePrices);
    pagesInput.addEventListener('input', updatePrices);
    printTypeRadios.forEach(radio => {
        radio.addEventListener('change', updatePrices);
    });
    
    // Delivery address
    deliveryInput.addEventListener('blur', updateDeliveryEstimation);
    
    // Extra notes
    extraNoteRadios.forEach(radio => {
        radio.addEventListener('change', handleExtraNoteChange);
    });
    
    // Buttons
    sendBtn.addEventListener('click', handleSendOrder);
    cancelBtn.addEventListener('click', handleCancel);
    popupClose.addEventListener('click', closePopup);
    downloadQRBtn.addEventListener('click', downloadQRCode);
    shareQRBtn.addEventListener('click', shareQRCode);
    
    // Close popup on outside click
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });
}

// Language Functions
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    const html = document.documentElement;
    
    html.lang = currentLanguage;
    html.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    updateTexts();
    updatePlaceholders();
}

function updateTexts() {
    const t = texts[currentLanguage];
    
    document.querySelectorAll('[data-lang-ar]').forEach(element => {
        const key = currentLanguage === 'ar' ? 'data-lang-ar' : 'data-lang-en';
        element.textContent = element.getAttribute(key);
    });
}

function updatePlaceholders() {
    document.querySelectorAll('[data-placeholder-ar]').forEach(element => {
        const key = currentLanguage === 'ar' ? 'data-placeholder-ar' : 'data-placeholder-en';
        element.placeholder = element.getAttribute(key);
    });
}

// Paper Type Handler
function handlePaperTypeChange() {
    const isCustom = paperTypeSelect.value === 'custom';
    customPaperInput.style.display = isCustom ? 'block' : 'none';
    
    if (isCustom) {
        customPaperInput.focus();
    }
}

// Extra Notes Handler
function handleExtraNoteChange() {
    const selectedNote = document.querySelector('input[name="extraNote"]:checked');
    const isOtherNotes = selectedNote && (selectedNote.value === 'ملاحظات أخرى' || selectedNote.value === 'Other notes');
    
    customNotesTextarea.style.display = isOtherNotes ? 'block' : 'none';
    
    if (isOtherNotes) {
        customNotesTextarea.focus();
    }
}

// Price Calculation Functions
function calculatePrintPrice(printType, copies, pages) {
    if (!printType || !copies || !pages) return 0;
    
    const rate = (printType === 'ملون' || printType === 'Color Print') ? 50 : 25;
    return (copies * pages * rate) / 1000;
}

function calculateDeliveryFee(distance) {
    if (!distance) return 0;
    
    if (distance <= 10) return 2;
    if (distance <= 25) return 2.5;
    return 5;
}

function updatePrices() {
    const printType = document.querySelector('input[name="printType"]:checked')?.value;
    const copies = parseInt(copiesInput.value) || 0;
    const pages = parseInt(pagesInput.value) || 0;
    
    const printPrice = calculatePrintPrice(printType, copies, pages);
    printPriceBox.textContent = `${printPrice.toFixed(3)} د.ك`;
    
    updateTotalPrice();
}

function updateTotalPrice() {
    const printPriceText = printPriceBox.textContent.replace(' د.ك', '');
    const deliveryPriceText = deliveryPriceBox.textContent.replace(' د.ك', '');
    
    const printPrice = parseFloat(printPriceText) || 0;
    const deliveryPrice = parseFloat(deliveryPriceText) || 0;
    
    const total = printPrice + deliveryPrice;
    totalPriceBox.textContent = `${total.toFixed(3)} د.ك`;
}

// Delivery Functions
const origin = { lat: 29.308770, lon: 47.940330 }; // Kuwait coordinates

async function getDistanceFromAddress(address) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Kuwait')}`);
        const data = await response.json();
        
        if (!data.length) return null;
        
        const destination = {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
        };
        
        return haversineDistance(origin.lat, origin.lon, destination.lat, destination.lon);
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

async function updateDeliveryEstimation() {
    const address = deliveryInput.value.trim();
    const t = texts[currentLanguage];
    
    if (!address) {
        distanceResult.style.display = 'none';
        deliveryPriceBox.textContent = '0.000 د.ك';
        updateTotalPrice();
        return;
    }
    
    distanceResult.textContent = t.calculating;
    distanceResult.style.display = 'block';
    
    const distance = await getDistanceFromAddress(address);
    
    if (distance === null) {
        distanceResult.textContent = t.locationError;
        deliveryPriceBox.textContent = '0.000 د.ك';
        updateTotalPrice();
        return;
    }
    
    const fee = calculateDeliveryFee(distance);
    distanceResult.textContent = `${t.distanceText} ${distance.toFixed(1)} كم — ${t.deliveryFeeText} ${fee.toFixed(3)} د.ك`;
    deliveryPriceBox.textContent = `${fee.toFixed(3)} د.ك`;
    
    updateTotalPrice();
}

// QR Code Functions
function generateQRCode(orderData) {
    const qrData = JSON.stringify({
        orderNumber: orderData.orderNumber,
        printType: orderData.printType,
        copies: orderData.copies,
        pages: orderData.pages,
        paperType: orderData.paperType,
        delivery: orderData.delivery,
        total: orderData.total,
        date: orderData.date,
        time: orderData.time,
        notes: orderData.notes
    });
    
    QRCode.toCanvas(qrCanvas, qrData, {
        width: 200,
        margin: 2,
        color: {
            dark: '#8b5cf6',
            light: '#ffffff'
        }
    }, function(error) {
        if (error) {
            console.error('QR Code generation error:', error);
        } else {
            qrDataUrl = qrCanvas.toDataURL();
            showQRSection();
        }
    });
}

function showQRSection() {
    qrSection.style.display = 'block';
    qrSection.scrollIntoView({ behavior: 'smooth' });
}

function downloadQRCode() {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `print-order-qr-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
}

async function shareQRCode() {
    if (!qrDataUrl || !navigator.share) return;
    
    try {
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        
        await navigator.share({
            title: 'Print Shop QR Code',
            files: [file]
        });
    } catch (error) {
        console.error('Error sharing QR code:', error);
    }
}

// Order Functions
function generateOrderData() {
    const now = new Date();
    const dateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const orderNumber = Math.floor(Math.random() * 900000) + 100000;
    
    const printType = document.querySelector('input[name="printType"]:checked')?.value || '';
    const copies = parseInt(copiesInput.value) || 0;
    const pages = parseInt(pagesInput.value) || 0;
    const delivery = deliveryInput.value.trim();
    
    let paperType = paperTypeSelect.value;
    if (paperType === 'custom') {
        paperType = customPaperInput.value.trim();
    }
    
    let notes = '';
    const selectedNote = document.querySelector('input[name="extraNote"]:checked');
    if (selectedNote) {
        if (selectedNote.value === 'ملاحظات أخرى' || selectedNote.value === 'Other notes') {
            notes = customNotesTextarea.value.trim();
        } else {
            notes = selectedNote.value;
        }
    }
    
    const printPrice = parseFloat(printPriceBox.textContent.replace(' د.ك', '')) || 0;
    const deliveryPrice = parseFloat(deliveryPriceBox.textContent.replace(' د.ك', '')) || 0;
    const total = parseFloat(totalPriceBox.textContent.replace(' د.ك', '')) || 0;
    
    return {
        orderNumber,
        date: dateString,
        time: timeString,
        printType,
        copies,
        pages,
        paperType,
        delivery,
        notes,
        printPrice,
        deliveryPrice,
        total
    };
}

function createWhatsAppMessage(orderData) {
    let message = `🖨️ برنت شوب - طلب طباعة\n\n`;
    message += `📅 وقت الطلب: ${orderData.date} ${orderData.time}\n`;
    message += `🔢 رقم الطلب: #${orderData.orderNumber}\n\n`;
    message += `📝 نوع الطباعة: ${orderData.printType}\n`;
    message += `📄 عدد النسخ: ${orderData.copies}\n`;
    message += `📄 عدد الأوراق: ${orderData.pages}\n`;
    message += `🗒️ نوع الورق: ${orderData.paperType}\n`;
    
    if (orderData.delivery) {
        message += `📍 عنوان التوصيل: ${orderData.delivery}\n`;
    }
    
    if (orderData.notes) {
        message += `🗂️ ملاحظات: ${orderData.notes}\n`;
    }
    
    message += `\n💸 سعر الطباعة: ${orderData.printPrice.toFixed(3)} د.ك\n`;
    message += `💸 سعر التوصيل: ${orderData.deliveryPrice.toFixed(3)} د.ك\n`;
    message += `💵 الإجمالي: ${orderData.total.toFixed(3)} د.ك\n\n`;
    message += `📱 يمكنك مسح الـ QR Code المرفق للحصول على تفاصيل الطلب`;
    
    return message;
}

async function handleSendOrder() {
    const orderData = generateOrderData();
    
    // Validate required fields
    if (!orderData.printType) {
        alert(currentLanguage === 'ar' ? 'يرجى اختيار نوع الطباعة' : 'Please select print type');
        return;
    }
    
    if (!orderData.copies || !orderData.pages) {
        alert(currentLanguage === 'ar' ? 'يرجى إدخال عدد النسخ والأوراق' : 'Please enter number of copies and pages');
        return;
    }
    
    // Generate QR Code
    generateQRCode(orderData);
    
    // Create WhatsApp message
    const message = createWhatsAppMessage(orderData);
    const whatsappUrl = `https://wa.me/96590010901?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success popup
    showPopup();
}

function handleCancel() {
    if (confirm(currentLanguage === 'ar' ? 'هل تريد إلغاء الطلب؟' : 'Do you want to cancel the order?')) {
        window.location.reload();
    }
}

// Popup Functions
function showPopup() {
    popup.style.display = 'flex';
}

function closePopup() {
    popup.style.display = 'none';
}

// Utility Functions
function formatPrice(price) {
    return `${price.toFixed(3)} د.ك`;
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Service Worker Registration (Optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}