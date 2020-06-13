var Camara;
var BotonesEntrenar;
var knn;
var modelo;
var Texto;
var Clasificando = false;
var InputTextBox;
var BotonTextBox

function setup() {
  createCanvas(320, 240);
  background(250,0,0);
  Camara = createCapture(VIDEO);
  Camara.size(320,240);
  Camara.hide();

  modelo = ml5.featureExtractor('MobileNet', ModeloListo);
  knn = ml5.KNNClassifier();

  createP('Presiona Botones para entrenar');

  var BotonContador = document.getElementById("botonContador");

  var BotonAdministrativo = document.getElementById("botonAdministrativo");

  var BotonIngeniero = document.getElementById("botonIngeniero");

  var BotonInvitado = document.getElementById("botonInvitado");

  var BotonCelular = document.getElementById("botonCelular");

  var BotonNada = document.getElementById("botonNada");

  //Seccion del TextBox para entrenar con datos que el usuario ingrese
  createP("Entrena usando un TextBox");
  InputTextBox = createInput('Cosa 2');
  BotonTextBox = createButton('Entrenar con '+InputTextBox.value());
  BotonTextBox.mousePressed(EntrenarTextBox);

  createP("Guardar o Cargar Neurona");

  var BotonGuardar = createButton('Guardar');
  BotonGuardar.mousePressed(GuardarNeurona);
  var BotonCargar = createButton('Cargar');
  BotonCargar.mousePressed(CargarNeurona);

  Texto = createP("Modelo no esta listo, esperando...");

  BotonesEntrenar = selectAll(".BotonEntrenar");

  for (var B = 0; B < BotonesEntrenar.length; B++) {
    BotonesEntrenar[B].style("margin", "5px");
    BotonesEntrenar[B].style("padding", "6px");
    BotonesEntrenar[B].mousePressed(PresionandoBoton);
  }
}

function PresionandoBoton(){
  var NombreBoton = this.elt.innerHTML;
  console.log("Entrenando con "+ NombreBoton);
  EntrenarKnn(NombreBoton);
}

function EntrenarKnn(ObjetoEntrenar){
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, ObjetoEntrenar);
}

function ModeloListo(){
  console.log("Modelo Listo");
  Texto.html("El modelo ya está listo. Puede comenzar a entrenar");
}

function clasificar(){
  const Imagen = modelo.infer(Camara);
  knn.classify(Imagen, function(error, result){
    if(error){
      console.error();
    } else{
      Texto.html("Es un " + result.label);
      clasificar();
    }
  });
}

function EntrenarTextBox(){
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, InputTextBox.value());
}

function GuardarNeurona() {
  if (Clasificando) {
    knn.save("modelo.json");
  }
}

function CargarNeurona() {
  console.log("Cargando una Neurona");
  knn.load("./modelo.json", function() {
    console.log("Neurona Cargada knn");
    Texto.html("Neurona cargada de archivo");
    console.log(knn.getNumLabels());
  })
}

function draw() {
  image(Camara, 0, 0, 320, 240);
  BotonTextBox.html("Entrenar con "+InputTextBox.value());
  if(knn.getNumLabels() > 0 && !Clasificando){
    clasificar();
    Clasificando = true;
  }
}
