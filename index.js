import "./components/FechaPorSemana.js"

let diasSemana = [
    "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"
  ]

const meses = {
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
  let fechas = [
      "2024-04-19",
      "2024-04-22",
      "2024-04-23",
      "2024-04-24",
      "2024-04-25",
      "2024-04-26",
      "2024-04-29",
      "2024-04-30",
      "2024-05-02",
      "2024-05-03",
      "2024-05-06",
      "2024-05-07",
      "2024-05-08",
      "2024-05-09",
      "2024-05-10",
  ];
  
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
    document.getElementById(diasSemana[i]).innerText = todas[i].fecha.split("-")[2];
    document.getElementById(diasSemana[i]).value = todas[i];
  }

  recargarClases()

  siguienteRango.addEventListener("click", () => {

    let con = 0

    let ultimoDia = document.getElementById("domingo").value.fecha
    console.log(ultimoDia)
    let ultimoDiaIndex = todas.findIndex(elementoFecha => elementoFecha.fecha == ultimoDia)
    console.log(ultimoDiaIndex)

    if(ultimoDiaIndex < todas.length-1){
        for (let index = ultimoDiaIndex + 1 ; index < ultimoDiaIndex + 8; index++) {
            document.getElementById(diasSemana[con]).innerText = todas[index].fecha.split("-")[2]
            document.getElementById(diasSemana[con]).value = todas[index]
            
            con ++
        }
        recargarClases()
    }

  })

  anteriorRango.addEventListener("click", () => {

    let con = 0

    let primerDia = document.getElementById("lunes").value.fecha
    let primerDiaIndex = todas.findIndex(elementoFecha => elementoFecha.fecha == primerDia)

   if(primerDiaIndex > 0){
    for (let index = primerDiaIndex - 7 ; index < primerDiaIndex ; index++) {
            document.getElementById(diasSemana[con]).innerText = todas[index].fecha.split("-")[2]
            document.getElementById(diasSemana[con]).value = todas[index]
            
            con ++
        }
        recargarClases()
    }
  })



document.querySelectorAll("span.diaSemana").forEach( btnDia => {
    btnDia.addEventListener("click", (e) => {
        console.log(e.target.value)
        todas.forEach(elementoFecha => {
           if(elementoFecha.fecha == e.target.value.fecha){
               elementoFecha.seleccionado = true
           }else{
            elementoFecha.seleccionado = false
           }
        })
        // console.log(todas.findIndex(elementoFecha => elementoFecha.fecha== e.target.value.fecha))
        // let pos = todas.findIndex(elementoFecha => elementoFecha.fecha== e.target.value.fecha)
        // todas[pos].seleccionado = true
        recargarClases()
    })
})
  

function recargarClases(){
    document.getElementById("fechas-mes").innerText = meses[jueves.value.fecha.split("-")[1]]


    const botones = document.querySelectorAll("span.diaSemana")
    botones.forEach( btnDia => {
        if(btnDia.value.seleccionado){
            btnDia.classList.add("seleccionado")
            document.getElementById("fechas-mes").innerText = meses[btnDia.value.fecha.split("-")[1]]

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


  