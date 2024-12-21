document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const options = {};

  // Form 데이터 추출
  formData.forEach((value, key) => {
    if (!options[key]) options[key] = [];
    options[key].push(value);
  });

  // JSON 데이터 생성
  const userInput = {
    options: options,
    top_k: 3,
    text: document.getElementById("message").value || null,
  };

  // Fetch를 사용해 API 호출
  fetch("/wedding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInput),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("API 요청에 실패했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      const resultsContainer = document.getElementById("recommendation-list");
      resultsContainer.innerHTML = ""; // 기존 결과 초기화

      data.forEach((item) => {
        const li = document.createElement("li");
        li.style.textAlign = "left"; // 리스트 아이템 왼쪽 정렬
        li.style.marginBottom = "20px";

        // 링크와 이미지를 포함하여 출력
        const fileLink = `https://www.instagram.com/${item.filtered_image_filename}/`;
        const imageUrl = `/wedding/images/${item.image_filename}`;
        li.innerHTML = `
          <a href="${fileLink}" target="_blank" style="text-decoration: none; color: #007bff;">
            ${fileLink}
          </a><br>
          <img src="${imageUrl}" alt="추천 이미지" style="max-width: 500px; height: auto; margin-top: 10px; display: block;">
        `;

        resultsContainer.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("추천 결과를 가져오는데 실패했습니다.");
    });
});
