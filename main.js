
        const db = new Dexie("PowerDB");
        db.version(1).stores({ logs: '++id, volt, current, power, frequency, energy, time' });

        function updateUI(data) {
            document.getElementById('v-val').innerText = data.volt.toFixed(2);
            document.getElementById('c-val').innerText = data.current.toFixed(2);
            document.getElementById('p-val').innerText = data.power.toFixed(2);
            document.getElementById('f-val').innerText = data.frequency.toFixed(2);
            document.getElementById('e-val').innerText = data.energy.toFixed(2);
        }

        function renderTable() {
            db.logs.orderBy('id').reverse().limit(10).toArray().then(logs => {
                document.getElementById('log-body').innerHTML = logs.map(l => 
                    `<tr class="border-b border-slate-800"><td class="p-2">${l.time}</td><td>${l.volt}V</td><td>${l.current}mA</td><td>${l.power}W</td></tr>`
                ).join('');
            });
        }

        // Mode Simulasi
        document.getElementById('btn-simulasi').onclick = () => {
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('dashboard-section').classList.remove('hidden');
            document.getElementById('status-dot').className = 'w-4 h-4 rounded-full bg-yellow-500';
            document.getElementById('status-text').innerText = 'Mode Simulasi';
            
            setInterval(() => {
                const mock = { volt: 220 + Math.random(), current: 10 + Math.random(), power: 2200 + Math.random(), frequency: 50, energy: 1.2 };
                updateUI(mock);
                db.logs.add({...mock, time: new Date().toLocaleString()});
                renderTable();
            }, 2000);
        };

        // Jam
        setInterval(() => {
            document.getElementById('clock').innerText = new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString();
        }, 1000);

        lucide.createIcons();
  