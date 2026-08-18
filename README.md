# SubTrack – Abonelik & Dijital Gider Yönetim Paneli

SubTrack, tüm dijital aboneliklerinizi tek bir yerden yönetmenizi sağlayan modern bir web uygulamasıdır.

## Özellikler

- Abonelik ekleme, düzenleme ve silme
- Yenileme tarihi uyarıları (1-7 gün önce)
- Çoklu para birimi desteği (USD, EUR, GBP, JPY, TRY)
- Anlık döviz kuru API entegrasyonu
- Kategori ve durum bazlı filtreleme
- Toplu işlem desteği (seç, duraklat, sil)
- Izgara ve liste görünümü
- Takvim görünümü
- Detaylı analiz grafikleri (pasta, bar, trend)
- Bütçe yönetimi ve limit uyarıları
- Hayalet gider tespiti
- CSV ve JSON dışa/içe aktarma
- Yazdırma desteği
- Karanlık/aydınlık tema
- Global arama
- Klavye kısayolları (Ctrl+N, Ctrl+F)
- Tarayıcı bildirimleri
- PWA desteği
- Tamamen offline çalışır (localStorage)

## Teknolojiler

- Vanilla HTML5
- CSS3 (CSS Variables, Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Canvas API (grafikler için)
- ExchangeRate API (döviz kurları)
- localStorage (veri saklama)

## Kurulum

1. Projeyi klonlayın veya indirin
2. `index.html` dosyasını tarayıcıda açın
3. Hiçbir bağımlılık yoktur, internet bağlantısı yalnızca döviz kurları için gereklidir

## Kullanım

### Abonelik Ekleme
- Sol panelden **Abonelik Ekle** butonuna tıklayın veya **Ctrl+N** kısayolunu kullanın
- Hizmet adını yazarken otomatik tamamlama önerileri çıkar

### Klavye Kısayolları
| Kısayol | İşlev |
|---------|-------|
| `Ctrl+N` | Yeni abonelik ekle |
| `Ctrl+F` | Global arama |
| `1` | Dashboard |
| `2` | Aboneliklerim |
| `3` | Analiz |
| `4` | Bütçe |
| `5` | Uyarılar |

### Dışa Aktarma
- **CSV İndir**: Excel'de açılabilir format
- **JSON Yedek**: Tam veri yedeği
- **Yedek Yükle**: JSON yedeğini geri yükle

## Ekran Görüntüleri

### Dashboard
Aylık/yıllık toplam, hayalet giderler, yaklaşan yenilemeler ve bütçe durumu tek ekranda.

### Analiz
Kategori dağılımı, para birimi analizi, aylık trend ve tasarruf fırsatları.

### Takvim
Tüm yenileme tarihlerini takvim görünümünde takip edin.

### Bütçe
Kategori bazlı aylık bütçe limitleri ve ilerleme çubukları.

## Lisans

MIT License – Enes Gökağaç
