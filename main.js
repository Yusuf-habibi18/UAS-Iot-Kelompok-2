document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Database
    const db = new Dexie("PowerDB");
    db.version(1).stores({ logs: '++id, volt, current, power, frequency, energy, time' });

    // 2. Fungsi Update UI
    function updateUI(data) {
        // Cek dulu elemennya ada atau tidak sebelum mengubahnya
        if(document.getElementById('v-val')) document.getElementById('v-val').innerText = data.volt.toFixed(2);
        if(document.getElementById('c-val')) document.getElementById('c-val').innerText = data.current.toFixed(2);
        if(document.getElementById('p-val')) document.getElementById('p-val').innerText = data.power.toFixed(2);
        if(document.getElementById('f-val')) document.getElementById('f-val').innerText = data.frequency.toFixed(2);
        if(document.getElementById('e-val')) document.getElementById('e-val').innerText = data.energy.toFixed(2);
    }

    // 3. Render Tabel
    function renderTable() {
        db.logs.orderBy('id').reverse().limit(10).toArray().then(logs => {
            const tbody = document.getElementById('log-body');
            if(tbody) {
                tbody.innerHTML = logs.map(l => 
                    `<tr class="border-b border-slate-800">
                        <td class="p-2">${l.time}</td>
                        <td>${parseFloat(l.volt).toFixed(2)}V</td>
                        <td>${parseFloat(l.current).toFixed(2)}mA</td>
                        <td>${parseFloat(l.power).toFixed(2)}W</td>
                    </tr>`
                ).join('');
            }
        });
    }

    // 4. Logika Mode Simulasi
    const btnSimulasi = document.getElementById('btn-simulasi');
    if(btnSimulasi) {
        btnSimulasi.onclick = () => {
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('dashboard-section').classList.remove('hidden');
            document.getElementById('status-dot').className = 'w-4 h-4 rounded-full bg-yellow-500';
            document.getElementById('status-text').innerText = 'Mode Simulasi';
            
            setInterval(() => {
                const mock = { 
                    volt: 220 + Math.random(), 
                    current: 10 + Math.random(), 
                    power: 2200 + Math.random(), 
                    frequency: 50, 
                    energy: 1.2 
                };
                updateUI(mock);
                db.logs.add({...mock, time: new Date().toLocaleTimeString()});
                renderTable();
            }, 2000);
        };
    }

    // 5. Jam
    setInterval(() => {
        const clock = document.getElementById('clock');
        if(clock) clock.innerText = new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString();
    }, 1000);

    // Initial check for icons
    if(typeof lucide !== 'undefined') lucide.createIcons();
});
