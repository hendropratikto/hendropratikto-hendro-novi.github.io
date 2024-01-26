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
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
      .glowing-text {
          color: white;
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

  const commentForm = document.getElementById("comment-form");
  const commentsContainer = document.getElementById("comments-container");

  commentsRef.on("value", (snapshot) => {
    commentsContainer.innerHTML = "";

    snapshot.forEach((childSnapshot) => {
      const comment = childSnapshot.val();

      const kehadiranText = comment.kehadiran === "Hadir" ? "Hadir" : "Tidak Hadir";
      const kehadiranColor = comment.kehadiran === "Hadir" ? "info" : "danger";
      const iconClass = comment.kehadiran === "hadir" ? "fas fa-check" : "fas fa-times"; // Menyesuaikan dengan kelas ikon Font Awesome

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
      commentRow.innerHTML = `<div class="col-12">
      <strong class="glowing-text glowing-text-animation">${comment.nama}</strong>
                              <div class="badge bg-${kehadiranColor}" style="box-shadow: 0 0 15px rgba(0,0,255,0.3);">
                                ${kehadiranText} 
                              </div> |
                              <small style="color: white; font-size: 12px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">${waktu} ${hari}. ${tanggal} ${bulan} ${jam}</small>
                              <br>
                              <span style="color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">${comment.komentar}</span>
                            </div>`;
                            commentRow.style.borderBottom = "1px solid #ddd"; // Menambahkan garis di bawah komentar
      commentsContainer.appendChild(commentRow);
    });
  });

  const form = document.getElementById("comment-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Dapatkan data dari formulir
    const data = new FormData(form);

    // Simpan data ke Firebase Realtime Database
    commentsRef
      .push({
        nama: data.get("nama"),
        komentar: data.get("komentar"),
        kehadiran: data.get("kehadiran"),
        waktu: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        console.log("Komentar berhasil Terkirim!");
        Swal.fire({
            icon: 'success',
            title: 'Sukses',
            text: 'Komentar berhasil Terkirim!',
            showCloseButton: true,
            showProgressBar: true,
        });
    
        // Mengosongkan isi formulir
        form.reset();
    })
    .catch((error) => {
      console.error("Error saving comment: ", error);
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan saat menyimpan komentar.',
          showCloseButton: true,
          showProgressBar: true,
      });
    });  
  });
});
