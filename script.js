document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyBKerJRg-zOqbTV_3BjZCAEQeAb6TFBXY4",
    authDomain: "hendro-ika.firebaseapp.com",
    databaseURL: "https://hendro-ika-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hendro-ika",
    storageBucket: "hendro-ika.appspot.com",
    messagingSenderId: "529919146758",
    appId: "1:529919146758:web:643f247799a9a5d6e53c87",
  };

  firebase.initializeApp(firebaseConfig);

  // Membuat elemen style
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
      .glowing-text {
          color: #9575cd;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }

      @keyframes glowing {
          0% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); }
          50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
          100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); }
      }

      .glowing-text-animation {
          animation: glowing 1.5s infinite;
      }
  `;

  // Menambahkan elemen style ke dalam elemen head
  document.head.appendChild(styleElement);

  const commentsRef = firebase.database().ref("comments");
  const commentsContainer = document.getElementById("comments-container");

  // Mengambil komentar dari Firebase, diurutkan berdasarkan timestamp secara descending
  commentsRef.orderByChild("waktu").once("value", (snapshot) => {
    // Memperoleh data komentar
    let commentsData = snapshot.val();

    // Mengonversi objek data komentar menjadi array
    let commentsArray = Object.values(commentsData);

    // Membalik array agar komentar yang terbaru berada di atas
    commentsArray.reverse();

    // Menyimpan snapshot komentar
    commentsSnapshot = commentsArray;

    // Menampilkan komentar pada halaman pertama
    displayComments(currentPage, commentsArray);

    // Membuat tombol pagination setelah mendapatkan data komentar
    createPaginationButtons(Math.ceil(commentsArray.length / commentsPerPage));
  });

  const commentsPerPage = 5; // Jumlah komentar per halaman
  let currentPage = 1;

  function displayComments(pageNumber, comments) {
    commentsContainer.innerHTML = "";

    const startIndex = (pageNumber - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    const commentsToDisplay = comments.slice(startIndex, endIndex);

    commentsToDisplay.forEach((comment) => {
      const kehadiranText = comment.kehadiran === "Hadir" ? "Hadir" : "Tidak Hadir";
      const kehadiranColor = comment.kehadiran === "Hadir" ? "info" : "danger";

      const formattedTime = comment.waktu
        ? new Date(comment.waktu).toLocaleString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })
        : "Waktu tidak tersedia";

      // Membuat teks hari, tanggal, bulan, tahun, dan jam
      const [waktu, hari, tanggal, bulan, tahun, jam] = formattedTime.split(" ");

      const commentRow = document.createElement("div");
      commentRow.className = "row justify-content-center mt-2";
      commentRow.innerHTML = `
      <div class="col-12">
        <strong class="glowing-text glowing-text-animation">${comment.nama}</strong>
        <div class="badge bg-${kehadiranColor}" style="box-shadow: 0 0 15px rgba(0, 0, 255, 0.3);">
          ${kehadiranText}
        </div> |
        <small style="color: #9575cd; font-size: 12px; text-shadow: 2px 2px 4px #d1c1f1;">${waktu} ${hari}. ${tanggal} ${bulan} ${jam}</small>
        <br>
        <span style="color: #9575cd; text-shadow: 2px 2px 4px #d1c1f1;">${comment.komentar}</span>
      </div>`;
    commentRow.style.borderBottom = "1px solid #ddd"; // Menambahkan garis di bawah komentar
    commentsContainer.appendChild(commentRow);
    });
  }

  // Fungsi untuk membuat tombol paginasi
  function createPaginationButtons(totalPages) {
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = ""; // Kosongkan container sebelum menambahkan tombol

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.innerText = i;
      button.style.marginTop = "10px"; // Menambahkan margin atas
      button.style.marginRight = "10px"; // Menambahkan margin 
      button.style.lineHeight = "18px"; 
      button.style.width      = "38px";
      button.addEventListener("click", () => {
        currentPage = i;
        displayComments(currentPage, commentsSnapshot); // Gunakan snapshot yang diambil dari Firebase

        // Hapus kelas 'active' dari semua tombol
        const buttons = paginationContainer.querySelectorAll("button");
        buttons.forEach((btn) => {
          btn.classList.remove("active");
        });

        // Tandai tombol yang sedang aktif
        button.classList.add("active");
        // Setiap kali tombol pagination diklik, urutkan kembali data komentar
        commentsRef.orderByKey().once("value", (snapshot) => {
          const commentsData = snapshot.val();
          const commentsArray = Object.values(commentsData);
          const reversedComments = commentsArray.reverse();
          displayComments(currentPage, reversedComments);
        });
      });

      // Tambahkan kelas 'active' ke tombol saat tombol dibuat
      if (i === currentPage) {
        button.classList.add("active");
      }

      // Tambahkan gaya ke tombol yang aktif
      button.classList.add("pagination-button");

      paginationContainer.appendChild(button);
    }
  }

  // Fungsi untuk menghitung jumlah komentar
  function countComments() {
    commentsRef.once("value", function (snapshot) {
      const jumlahKomentar = snapshot.numChildren();
      // Menampilkan jumlah komentar di dalam elemen jumlah-komentar-container
      const jumlahKomentarContainer = document.getElementById("jumlah-komentar-container");
      jumlahKomentarContainer.innerText = `Wedding Wishes : ${jumlahKomentar}`;
      jumlahKomentarContainer.style.marginTop = "10px"; // Menambahkan margin atas
      jumlahKomentarContainer.style.color = "hotpink"; // Mengubah warna teks menjadi merah muda
      jumlahKomentarContainer.style.fontWeight = "bold"; // Membuat teks menjadi bold
      jumlahKomentarContainer.style.textAlign = "center"; // Membuat teks berada di tengah
      jumlahKomentarContainer.style.fontFamily = "Sacramento, cursive"; // Menggunakan font Sacramento
      jumlahKomentarContainer.style.fontSize = "40px"; // Memperbesar ukuran font
    });
  }

  // Memuat semua komentar dan menampilkan halaman pertama
  let commentsSnapshot;

  commentsRef.once("value", (snapshot) => {
    commentsSnapshot = Object.values(snapshot.val() || {}); // Ubah snapshot ke dalam array
    const totalPages = Math.ceil(commentsSnapshot.length / commentsPerPage);

    // Tambahkan container untuk tombol paginasi
    const paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination-container";
    document.body.appendChild(paginationContainer);

    displayComments(currentPage, commentsSnapshot);
    createPaginationButtons(totalPages);
    // Memanggil fungsi penghitungan jumlah komentar setelah semua komentar dimuat
    countComments();
  });

  const form = document.getElementById("comment-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  
    // Dapatkan data dari formulir
    const formData = new FormData(form);
  
    // Fetch IP address first
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        const ip = data.ip;
  
        // Cek apakah IP sudah ada di Firebase
        commentsRef.orderByChild('ip').equalTo(ip).once('value', snapshot => {
          if (snapshot.exists()) {
            // IP sudah ada, tampilkan pesan kesalahan
            Swal.fire({
              icon: "warning",
              title: "Maaf",
              text: "Anda sudah pernah mengirim ungkapan :).",
              showCloseButton: true,
              showProgressBar: true,
            });
          } else {
            // IP belum ada, simpan data ke Firebase Realtime Database
            commentsRef
              .push({
                nama: formData.get("nama"),
                komentar: formData.get("komentar"),
                kehadiran: formData.get("kehadiran"),
                waktu: firebase.database.ServerValue.TIMESTAMP,
                ip: ip
              })
              .then((snapshot) => {
                console.log("Komentar berhasil Terkirim!");
                Swal.fire({
                  icon: "success",
                  title: "Sukses",
                  text: "Komentar berhasil Terkirim!",
                  showCloseButton: true,
                  showProgressBar: true,
                });
  
                // Mengambil komentar baru dari Firebase untuk memastikan sinkronisasi
                commentsRef.once('value', (snapshot) => {
                  const comments = [];
                  snapshot.forEach(childSnapshot => {
                    const childData = childSnapshot.val();
                    comments.push({
                      nama: childData.nama,
                      komentar: childData.komentar,
                      kehadiran: childData.kehadiran,
                      waktu: childData.waktu,
                    });
                  });
  
                  // Tampilkan kembali komentar dengan data terbaru
                  displayComments(1, comments);
                });
  
                // Mengosongkan isi formulir
                form.reset();
              })
              .catch((error) => {
                console.error("Error saving comment: ", error);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Terjadi kesalahan saat menyimpan komentar.",
                  showCloseButton: true,
                  showProgressBar: true,
                });
              });
          }
        });
  
      })
      .catch(error => {
        console.error("Error fetching IP address: ", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Terjadi kesalahan saat mengambil alamat IP.",
          showCloseButton: true,
          showProgressBar: true,
        });
      });
  });
  
  
  // Fungsi untuk menambahkan komentar baru ke halaman
  function addCommentToPage(commentData) {
    // Dapatkan elemen HTML di mana komentar akan ditambahkan
    const commentsContainer = document.getElementById('comments-container');
  
    // Buat elemen baru untuk komentar
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
  
    // Tambahkan konten komentar ke elemen
    commentElement.innerHTML = `
      <h4>${commentData.nama}</h4>
      <p>${commentData.komentar}</p>
      <small>Hadir: ${commentData.kehadiran}</small>
      <small>Waktu: ${commentData.waktu}</small>
    `;
  
    // Tambahkan elemen komentar ke container
    commentsContainer.appendChild(commentElement);
  }  
});
