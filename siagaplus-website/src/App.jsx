
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Bike, Wrench, ShoppingCart, Home, Utensils, ShieldCheck, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function SiagaPlusHome() {
  const [selectedService, setSelectedService] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isQueueing, setIsQueueing] = useState(false);
  const [queueNumber, setQueueNumber] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", location: "" });
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("siagaplus_history");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("siagaplus_history", JSON.stringify(history));
  }, [history]);

  if (selectedService)
    return <BookingPage 
      service={selectedService} 
      goBack={() => setSelectedService(null)} 
      onSubmitQueue={(num, name, location) => {
        setQueueNumber(num);
        setUserInfo({ name, location });
        setIsQueueing(true);
        sendOrderToAdmin(num, selectedService, name, location);
        sendWhatsAppNotification(num, name, location, selectedService);
        setHistory(prev => [...prev, { queueNumber: num, service: selectedService, name, location, date: new Date().toLocaleString() }]);
      }} 
    />;

  if (isQueueing)
    return <QueuePage queueNumber={queueNumber} goHome={() => {
      setIsQueueing(false);
      setQueueNumber(null);
      setNotificationSent(false);
    }} onNotify={() => sendWhatsAppNotification(queueNumber, userInfo.name, userInfo.location, selectedService)} notificationSent={notificationSent} />;

  if (showProfile) return <ProfilePage goBack={() => setShowProfile(false)} />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">SiagaPlus</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowProfile(true)}>Profil</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ServiceCard icon={<Bike className="text-blue-600" />} title="SiagaRide" desc="Antar jemput cepat dan aman." onClick={() => setSelectedService("SiagaRide")} />
        <ServiceCard icon={<Wrench className="text-red-600" />} title="SiagaMekanik" desc="Servis motor ringan langsung ke lokasi." onClick={() => setSelectedService("SiagaMekanik")} />
        <ServiceCard icon={<ShoppingCart className="text-green-600" />} title="SiagaBelanja" desc="Belanja kebutuhan rumah tangga tanpa repot." onClick={() => setSelectedService("SiagaBelanja")} />
        <ServiceCard icon={<Home className="text-yellow-600" />} title="SiagaHome" desc="Bantuan bersih-bersih dan tugas rumah." onClick={() => setSelectedService("SiagaHome")} />
        <ServiceCard icon={<Utensils className="text-orange-600" />} title="SiagaJajan" desc="Titip jajan dan makanan favoritmu." onClick={() => setSelectedService("SiagaJajan")} />
        <ServiceCard icon={<ShieldCheck className="text-gray-600" />} title="SiagaSuper" desc="Layanan Superior yang siap membantu semua permintaan pekerjaan." onClick={() => setSelectedService("SiagaSuper")} />
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Riwayat Pesanan</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada riwayat pesanan.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index} className="text-sm border p-2 rounded">
                #{item.queueNumber} - {item.service} oleh {item.name} di {item.location} ({item.date})
              </li>
            ))}
          </ul>
        )}
        <Button variant="ghost" className="mt-4 text-red-500" onClick={() => setHistory([])}>
          Hapus Riwayat
        </Button>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-500">
        &copy; 2025 SiagaPlus. Semua hak dilindungi.
      </footer>
    </div>
  );

  function sendWhatsAppNotification(queueNumber, name, location, serviceName) {
    const phoneNumber = "6281234567890";
    const message = encodeURIComponent(`📢 Notifikasi Pesanan Masuk\n\nNomor Antrian: #${queueNumber}\nNama: ${name}\nLokasi: ${location}\nLayanan: ${serviceName}`);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
    setNotificationSent(true);
  }

  function sendOrderToAdmin(queueNumber, serviceName, name, location) {
    const phoneNumber = "6281234567890";
    const message = encodeURIComponent(`📦 Pesanan Baru!\n\nNomor Antrian: #${queueNumber}\nLayanan: ${serviceName}\nNama Pelanggan: ${name}\nLokasi: ${location}`);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  }
}

function ServiceCard({ icon, title, desc, onClick }) {
  return (
    <Card onClick={onClick} className="rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="text-4xl">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingPage({ service, goBack, onSubmitQueue }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    const queueNumber = Math.floor(Math.random() * 9000) + 1000;
    onSubmitQueue(queueNumber, name, location);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Button onClick={goBack} variant="outline" className="mb-4">← Kembali</Button>
      <h2 className="text-xl font-semibold mb-4">Pesan Layanan: {service}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nama Anda</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2" placeholder="Contoh: Budi" />
        </div>
        <div>
          <label className="block text-sm font-medium">Lokasi Penjemputan / Layanan</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded p-2" placeholder="Contoh: Jl. Kenanga No. 3, Bandung" />
        </div>
        <Button onClick={handleSubmit} disabled={submitting || !name || !location} className="w-full">{submitting ? "Memproses..." : "Kirim Pesanan"}</Button>
      </div>
    </div>
  );
}

function QueuePage({ queueNumber, goHome, onNotify, notificationSent }) {
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-xl font-semibold mb-2 text-green-700">Pesanan Berhasil!</h2>
      <p className="mb-4">Nomor antrean Anda:</p>
      <div className="text-4xl font-bold text-blue-600 mb-4">#{queueNumber}</div>

      <div className="space-y-4">
        <Button onClick={onNotify} disabled={notificationSent} className="w-full">
          {notificationSent ? "Notifikasi Terkirim" : "Kirim Notifikasi ke Admin"}
        </Button>
        <Button onClick={goHome} variant="outline" className="w-full">
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}

function ProfilePage({ goBack }) {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <Button onClick={goBack} variant="outline" className="mb-4">← Kembali</Button>
      <div className="relative rounded-xl overflow-hidden mb-6 max-h-56">
        <img src="/banner-siagaplus.png" alt="Banner SiagaPlus" className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-between p-6">
          <div className="flex items-center gap-4">
            <img src="/banner-Siagaplus.png.png" alt="Logo SiagaPlus" className="w-20 h-20 object-contain rounded-lg shadow-md" />
            <div>
              <h2 className="text-white text-xl font-bold drop-shadow-md">SiagaPlus</h2>
              <p className="text-white text-xs drop-shadow-sm">Satu Solusi Lengkap, Rumah Aman & Nyaman</p>
            </div>
          </div>
          <div className="flex justify-end">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg transition-all">
              <MessageCircle size={16} /> Hubungi Kami
            </a>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-blue-900">Tentang SiagaPlus</h2>
      <p className="mb-2 text-gray-700">
        <strong>SiagaPlus</strong> adalah platform layanan yang menyediakan berbagai kebutuhan harian Anda, mulai dari antar jemput (SiagaRide), layanan mekanik ke lokasi (SiagaMekanik), belanja kebutuhan rumah (SiagaBelanja), bantuan tugas rumah tangga (SiagaHome), hingga layanan titip jajan dan makanan favorit (SiagaJajan).
      </p>
      <p className="mb-2 text-gray-700">
        Kami berkomitmen untuk menjadi sahabat andalan Anda dalam situasi apapun, dengan layanan cepat, aman, dan profesional.
      </p>
      <div className="mt-6 text-gray-700">
        <p><strong>Alamat Kantor:</strong> Jl. Merdeka No.123, Bandung</p>
        <p><strong>Email:</strong> admin@siagaplus.id</p>
        <p><strong>WhatsApp Admin:</strong> +62 812-3456-7890</p>
      </div>
    </div>
  );
}
