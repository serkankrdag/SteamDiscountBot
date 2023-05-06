const steam_api_key = "your_steam_api_key"; // Steam Web API anahtarınızı buraya girin
const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2/`;
const app_list = {}; // tüm Steam oyunlarının listesi
const discount_games = []; // indirimli oyunların listesi

// Steam Web API'ye istek göndermek için kullanılacak fonksiyon
async function fetchFromSteamAPI(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Tüm Steam oyunlarının listesini almak için istek göndermek
fetchFromSteamAPI(url)
  .then(data => {
    // Tüm oyunları app_list nesnesine eklemek
    data.applist.apps.forEach(app => {
      app_list[app.appid] = app.name;
    });

    // İndirimli oyunları almak için ikinci istek göndermek
    const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2/`;
    return fetchFromSteamAPI(url);
  })
  .then(data => {
    // İndirimli oyunları discount_games dizisine eklemek
    const app_ids = data.applist.apps.map(app => app.appid);
    const url = `https://store.steampowered.com/api/featuredcategories?cc=TR&l=turkish&v=1&tag=Game&appid=0&appids=${app_ids.join(",")}&key=${steam_api_key}`;
    return fetchFromSteamAPI(url);
  })
  .then(data => {
    data.specials.items.forEach(item => {
      discount_games.push({
        name: app_list[item.id],
        discount_percent: item.discount_percent,
        final_price: item.final_price / 100 // fiyat kuruş cinsinden olduğu için TL'ye çevirmek
      });
    });
    console.log(discount_games);
  })
  .catch(error => console.log(error));
