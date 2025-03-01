self.onmessage = function(event) {
  const { blockNumber, difficulty, startNonce, step } = event.data;

  function sha256(message) {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      return crypto.subtle.digest("SHA-256", data).then(hashBuffer => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return "0x" + hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
      });
  }

  async function mine() {
      let nonce = BigInt(startNonce);
      const target = BigInt(2 ** (256 - Number(difficulty)));

      let startTime = performance.now();
      let lastUpdateTime = startTime;
      let hashesComputed = 0;

      while (true) {
          const message = blockNumber + nonce.toString();
          const hashVal = await sha256(message);
          hashesComputed++;

          if (BigInt(hashVal) < target) {
              const elapsedTime = (performance.now() - startTime) / 1000;
              self.postMessage({ nonce: nonce.toString(), hash: hashVal, elapsedTime });
              return;
          }

          nonce += BigInt(step);

          // ✅ อัปเดต Hash Rate ทุก 1 วินาที
          const currentTime = performance.now();
          if (currentTime - lastUpdateTime >= 1000) {
              const hashRate = hashesComputed / ((currentTime - startTime) / 1000);
              self.postMessage({ hashRate });
              lastUpdateTime = currentTime;
          }
      }
  }

  mine();
};
