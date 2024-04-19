class FechaPorSemana extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }

    connectedCallback() {
        // Escucha el evento DOMContentLoaded para asegurarte de que todo esté listo
        document.addEventListener("DOMContentLoaded", () => {
            this.init();
        });
        this.fechasString=this.getAttribute("fechas")
        // Escucha el cambio de fechas dentro del componente
        this.addEventListener('fechas-cambiadas', (e) => {
          const fechaSeleccionada = e.detail; // Obtén la fecha seleccionada
          console.log(`Fecha seleccionada: ${fechaSeleccionada}`);
          // Aquí puedes realizar otras acciones según la fecha seleccionada
        });
    }

    init() {
        
        let diasSemana = [
            "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"
          ]
        
        this.meses = {
            "01": "Enero",
            "02": "Febrero",
            "03": "Marzo",
            "04": "Abril",
            "05": "Mayo",
            "06": "Junio",
            "07": "Julio",
            "08": "Agosto",
            "09": "Septiembre",
            "10": "Octubre",
            "11": "Noviembre",
            "12": "Diciembre"
        }
        //   let fechas = [
        //       "2024-04-19",
        //       "2024-04-22",
        //       "2024-04-23",
        //       "2024-04-24",
        //       "2024-04-25",
        //       "2024-04-26",
        //       "2024-04-29",
        //       "2024-04-30",
        //       "2024-05-02",
        //       "2024-05-03",
        //       "2024-05-06",
        //       "2024-05-07",
        //       "2024-05-08",
        //       "2024-05-09",
        //       "2024-05-10",
        //   ];

        let fechas = JSON.parse(this.fechasString)  
        console.log(fechas)
          
          let step = 0;
          
          let fechaMin = new Date(fechas[0])
          let fechaMax = new Date(fechas[fechas.length-1])
          
          
          let dias = (fechaMax - fechaMin)/(60*60*24*1000)
          let todas = []
          for(let i = 0 ; i<= dias; i++){
              let disponible = false;
              let fechaAux = new Date( new Date(fechaMin).getTime() + new Date(i*(60*60*24*1000)).getTime()).toISOString().split('T')[0];
              if(fechas.includes(fechaAux)){
                  disponible = true
              }
              todas.push({fecha: fechaAux, disponible: disponible, seleccionado: false })
          }
          
          let diasAntes = Math.abs(new Date(fechaMin).getDay())
          for(let i = 1; i < diasAntes+1; i++){
            let fechaAux = new Date( new Date(fechaMin).getTime() - new Date(i*(60*60*24*1000)).getTime()).toISOString().split('T')[0];
            todas.unshift({
              fecha: fechaAux,
              disponible: false,
              seleccionado: false
            })
          }
          
          
          let diasDespues = Math.abs(new Date(todas[todas.length-1].fecha).getDay()-6)
          
          
          for(let i = 1; i < diasDespues+1; i++){
            let fechaAux = new Date( new Date(fechaMax).getTime() + new Date(i*(60*60*24*1000)).getTime()).toISOString().split('T')[0];
            todas.push({
              fecha: fechaAux,
              disponible: false,
              seleccionado: false
            })
          }
        
          
        
          for(let i = 0; i < 7; i++){
            this.shadowRoot.getElementById(diasSemana[i]).innerText = todas[i].fecha.split("-")[2];
            this.shadowRoot.getElementById(diasSemana[i]).value = todas[i];
          }
        
          this.recargarClases()
        
          this.shadowRoot.getElementById("siguienteRango").addEventListener("click", () => {
        
            let con = 0
        
            let ultimoDia = this.shadowRoot.getElementById("domingo").value.fecha
            console.log(ultimoDia)
            let ultimoDiaIndex = todas.findIndex(elementoFecha => elementoFecha.fecha == ultimoDia)
            console.log(ultimoDiaIndex)
        
            if(ultimoDiaIndex < todas.length-1){
                for (let index = ultimoDiaIndex + 1 ; index < ultimoDiaIndex + 8; index++) {
                    this.shadowRoot.getElementById(diasSemana[con]).innerText = todas[index].fecha.split("-")[2]
                    this.shadowRoot.getElementById(diasSemana[con]).value = todas[index]
                    
                    con ++
                }
                this.recargarClases()
            }
        
          })
        
          this.shadowRoot.getElementById("anteriorRango").addEventListener("click", () => {
        
            let con = 0
        
            let primerDia = this.shadowRoot.getElementById("lunes").value.fecha
            let primerDiaIndex = todas.findIndex(elementoFecha => elementoFecha.fecha == primerDia)
        
           if(primerDiaIndex > 0){
            for (let index = primerDiaIndex - 7 ; index < primerDiaIndex ; index++) {
                    this.shadowRoot.getElementById(diasSemana[con]).innerText = todas[index].fecha.split("-")[2]
                    this.shadowRoot.getElementById(diasSemana[con]).value = todas[index]
                    
                    con ++
                }
                this.recargarClases()
            }
          })
        
        
        
        this.shadowRoot.querySelectorAll("span.diaSemana").forEach( btnDia => {
            btnDia.addEventListener("click", (e) => {
                console.log(e.target.value)
                todas.forEach(elementoFecha => {
                   if(elementoFecha.fecha == e.target.value.fecha){
                       elementoFecha.seleccionado = true
                    //    document.getElementsByTagName("fecha-por-semana").setAttribute("ejemplo", e.target.value)
                       document.getElementsByTagName("fecha-por-semana")[0].value = e.target.value.fecha
                       const eventoFechasCambiadas = new CustomEvent('fechas-cambiadas', {
                        detail: e.target.value.fecha,
                      });
                      this.dispatchEvent(eventoFechasCambiadas);
                   }else{
                    elementoFecha.seleccionado = false
                   }
                })
                // console.log(todas.findIndex(elementoFecha => elementoFecha.fecha== e.target.value.fecha))
                // let pos = todas.findIndex(elementoFecha => elementoFecha.fecha== e.target.value.fecha)
                // todas[pos].seleccionado = true
                this.recargarClases()
            })
        })
          
        
        
    }

    recargarClases(){
        this.shadowRoot.getElementById("fechas-mes").innerText = this.meses[this.shadowRoot.getElementById("jueves").value.fecha.split("-")[1]]
    
    
        const botones = this.shadowRoot.querySelectorAll("span.diaSemana")
        botones.forEach( btnDia => {
            if(btnDia.value.seleccionado){
                btnDia.classList.add("seleccionado")
                this.shadowRoot.getElementById("fechas-mes").innerText = this.meses[btnDia.value.fecha.split("-")[1]]
    
            }else{
                btnDia.classList.remove("seleccionado")
            }
    
            if(btnDia.value.disponible){
                btnDia.classList.add("disponible")
            }else{
                btnDia.classList.remove("disponible")
                btnDia.classList.add("no-disponible")
    
            }
      })
    }

    render(){
        this.shadowRoot.innerHTML = `
        <section class="fechas-container">
      <header class="fechas-header">
        <svg
          id="anteriorRango"
          fill="none"
          width="28"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>

        <span id="fechas-mes">Febrero</span>

        <svg
          id="siguienteRango"
          fill="none"
          width="28"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </header>

      <div class="fechas-dias-nombre">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mie</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sab</span>
        <span>Dom</span>
      </div>
      <div class="fechas-dias-numero">
        <span id="lunes" class="diaSemana no-disponible">0</span>
        <span id="martes" class="diaSemana no-disponible">0</span>
        <span id="miercoles" class="diaSemana no-disponible">0</span>
        <span id="jueves" class="diaSemana no-disponible">0</span>
        <span id="viernes" class="diaSemana no-disponible">0</span>
        <span id="sabado" class="diaSemana no-disponible">0</span>
        <span id="domingo" class="diaSemana no-disponible">0</span>
      </div>

    </section>
    
    <footer class="fechas-footer">
        <div>
            <span class="fechas-round-icon gris"></span>
            <span class="fechas-texto-info">No disponibles</span>
        </div>
        <div>
            <span class="fechas-round-icon verde-claro"></span>
            <span class="fechas-texto-info">Disponibles</span>
        </div>
        <div>
            <span class="fechas-round-icon verde-oscuro"></span>
            <span class="fechas-texto-info">Seleccionado</span>
        </div>
      </footer>

      <style>
      .fechas-container{
        /* border: solid; */
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        width: auto;
        height: 209px;
        background-color: #FFF;
        padding: 10px 20px 20px 20px;
        border-radius: 10px;
      }
      
      .fechas-header{
        display: grid;
        grid-template-columns: 24px 1fr 24px;
        border-radius: 4px;
        place-items: center;
      }
      
      .fechas-dias-nombre{
        
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        align-items: center;
        justify-items: center;
        color: #a8a8a8;
      }
      
      .fechas-dias-numero{
        border: 2px solid #5CB615;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        align-items: center;
        justify-items: center;
        border-radius: 10px;
        overflow: hidden;
      }
      
      .fechas-dias-numero span{
        width: 100%;
        height: 100%;
        border-right: 1px solid #5CB615;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .no-disponible{
        background-color: #F5F5F5;
        color: #86888C;
        border: 1px solid #5CB615;
        pointer-events: none;
      }
      .disponible{
        background-color: #BDE4A4;
        color: #5CB615;
        border: 1px solid #5CB615;
        cursor: pointer;
        pointer-events: all;
      }
      
      .seleccionado{
        background-color: #5CB615;
        color: #FFFFFF;
        border: 1px solid #5CB615;
      }
    
    
      #siguienteRango, #anteriorRango{
        cursor: pointer;
        color: #5CB615;
      }
      
    
      .fechas-footer{
        display: grid;
        gap: 10px ;
        width: max-content;
        color: #86888C;
        margin: 20px;
      }
    
      .fechas-footer div{
        display: flex;
        gap: 10px;
        align-items: center;
      }
    
      .fechas-round-icon{
        width: 20px;
        height: 20px;
        display: inline-block;
        border-radius: 50%;
      }
    
    
      .gris{
        background-color: #C4C4C4;
      }
    
      .verde-claro{
        background-color: #BDE4A4;
      }
    
      .verde-oscuro{
        background-color: #5CB615;
      }
    
      #fechas-mes{
        font-size: 22px;
      }
      </style>
        `   
    }
}

customElements.define("fecha-por-semana", FechaPorSemana)

export {
    FechaPorSemana as FechaPorSemana,
  };