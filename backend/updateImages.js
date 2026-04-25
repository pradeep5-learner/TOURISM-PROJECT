require("dotenv").config();
const mongoose = require("mongoose");
const Place = require("./models/place");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    console.log("Connected to DB");

    const places = await Place.find();

    // ✅ IMAGE POOL (REAL WORKING LINKS)
    const imagePool = {

      beach: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
        "https://images.unsplash.com/photo-1724161179561-e9b991c83ec1",
        "https://images.unsplash.com/photo-1599325601183-042bed55081c",
        "https://images.unsplash.com/photo-1594312873175-351e72a4b55b",
        "https://plus.unsplash.com/premium_photo-1697729594707-0fc9e51c8eed",
        "https://images.unsplash.com/photo-1622173324953-adb598835e7a"
      ],

      temple: [
        "https://images.unsplash.com/photo-1565195161077-f5c5f61f9ea2",
        "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788",
        "https://images.unsplash.com/photo-1689525508929-eb6b773b1fd2",
        "https://images.unsplash.com/photo-1651934738667-995ffb15064b",
        "https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8",
        "https://media.istockphoto.com/id/516984446/photo/varanasi-burning-grounds-at-night.webp"
      ],

      nature: [
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1",
        "https://images.unsplash.com/photo-1629813538702-64c925934e19",
        "https://images.unsplash.com/photo-1622950320077-9a5533b9b191",
        "https://images.unsplash.com/photo-1662904264604-315444940b6a",
        "https://images.unsplash.com/photo-1713550668405-6d3b83a74599",
        "https://images.unsplash.com/photo-1734900638554-62e95b5968fe",
      ],

      heritage: [
        "https://images.unsplash.com/photo-1519955266818-0231b63402bc",
        "https://images.unsplash.com/photo-1620103143245-9efb3e4a7553",
        "https://images.unsplash.com/photo-1662101511535-7f5672bdf118",
        "https://images.unsplash.com/photo-1596901224267-67ca38199090",
        "https://images.unsplash.com/photo-1599982133112-2723acedc13a",
        "https://images.unsplash.com/photo-1717584971778-27509e64a7d1"
      ],

      waterfall: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1667760334198-d3958029a08b",
        "https://images.unsplash.com/photo-1621578847110-61f6cf5a3d9e",
        "https://images.unsplash.com/photo-1691440732239-4fba88777f8d",
        "https://images.unsplash.com/photo-1666676150369-0432625a712b",
        "https://images.unsplash.com/photo-1677773592270-f628ca2f12d6",
        "https://images.unsplash.com/photo-1676001151247-e24c738d2662",
        "https://images.unsplash.com/photo-1664168564454-4d4f33c836f8",
        "https://images.unsplash.com/photo-1669111685793-600c1abbbb06"
      ],

      default: [
        "https://images.unsplash.com/photo-1504542982118-59308b40fe0c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    };

    function random(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function getImage(category = "") {

      const cat = category.toLowerCase();

      if (cat.includes("beach")) return random(imagePool.beach);
      if (cat.includes("temple")) return random(imagePool.temple);
      if (cat.includes("waterfall")) return random(imagePool.waterfall);
      if (cat.includes("nature")) return random(imagePool.nature);
      if (cat.includes("heritage") || cat.includes("historical"))
        return random(imagePool.heritage);

      return random(imagePool.default);
    }

    // 🔥 UPDATE ALL PLACES
    for (let place of places) {

      const imageUrl = getImage(place.category);

      place.image = imageUrl;

      await place.save();

      console.log("Updated:", place.name);
    }

    console.log("✅ ALL IMAGES UPDATED");
    process.exit();

  })
  .catch(err => console.error(err));