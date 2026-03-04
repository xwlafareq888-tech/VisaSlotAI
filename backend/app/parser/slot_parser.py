from bs4 import BeautifulSoup


def detect_slots(html: str, provider: str = "unknown"):
    """
    Verilen HTML içeriğinde sağlayıcıya (provider) göre açık randevu var mı kontrol eder.
    """
    soup = BeautifulSoup(html, "html.parser")
    slots = []

    # iData (Almanya, İtalya vb.) mantığı
    if provider == "idata":
        # iData'da hata mesajı / randevu yok yazısı görünmüyorsa potansiyel olarak randevu vardır.
        # Ya da tam tersi özel bir buton görünüyorsa.
        # Şimdilik örnek olarak "Randevu Al" tarzı butonları arayalım.
        buttons = soup.find_all(["button", "a"])
        for btn in buttons:
            text = btn.get_text(strip=True).lower()
            if "randevu al" in text or "book appointment" in text:
                slots.append(text)
        
        # Eğer sayfa yüklenmiş ama içinde "Tüm randevular doludur" yazısı yoksa 
        # fake bir slot da dönebiliriz. (Detaylı iData analizi gerekir)

    # VFS Global mantığı
    elif provider == "vfs_global":
        body_text = soup.body.get_text(strip=True).lower() if soup.body else ""
        if "no appointment slots are currently available" not in body_text and "randevu bulunmamaktadır" not in body_text:
            # Eğer sayfada 'randevu yok' demiyorsa, ve sayfaya başarıyla girildiyse (robot kontrolünü geçtiysek)
            # bir ihtimal slot açılmış olabilir
            if "schedule an appointment" in body_text or "randevu al" in body_text:
                slots.append("VFS Slot Potansiyel Olarak Açık!")

    # Bilinmeyen / Test amaçlı genel mantık
    else:
        buttons = soup.find_all("button")
        for button in buttons:
            text = button.get_text(strip=True).lower()
            if "available" in text or "uygun" in text:
                slots.append(text)

    # Aynı slot kayıtlarını tekilleştir
    return list(set(slots))