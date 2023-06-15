//el codigo funciona digitando los valores en los lugares establecidos si se desea desempeñar dicha funcion de crud
//esta solo funciona en el mismo codigo, NO EN CONSOLA.
const { MongoClient } = require('mongodb');//conexion a mongodb
const {faker} = require ('@faker-js/faker');//conexion a faker 
//variable que realiza la conexion a la base de datos de juanda
const uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority";
//crea la coleccion de sanciones y la envia a la base de datos
async function crearColeccionSanciones() {
  const cliente = new MongoClient(uri);

  try {
    await cliente.connect();
    const resultado = await cliente.db('BookWare').createCollection('Sanciones', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'validacionSanciones',
          required: ['idSancion','idUsuario','motivoSancion','fechaRegistroSancion'],
          properties: {
            idSancion: {
              bsonType: "int"
            },
            idUsuario: {
              bsonType: "int"
            },
            motivoSancion: {
              bsonType: "string"
            },
            fechaRegistroSancion: {
              bsonType: "date"
            }
          }
        }
      }
    });

    if (resultado) {
      console.log("Coleccion creada");
    } else {
      console.log("no funciona")
    }
  } catch (e) {
    console.log(e);
  } finally {
    await cliente.close();
  }
}

//funcion para realizar la conexion al id de los usuarios y asi a los usuarios existentes se les realizan las sanciones.
async function obtenerIdUsuarios() {
    const cliente = new MongoClient(uri);

    try {

       await cliente.connect();

       const resultado  = await cliente.db('BookWare').collection('usuarios').aggregate([{
        $project:{
            _id:0,idUsuario:1
        }
       }]).toArray();
       return resultado
    }catch(e){
        console.log(e)
    }

    
}
crearSancion()

//funcion que crea las sanciones 
async function crearSancion() {

    const cliente = new MongoClient(uri);

    try {

    
       await cliente.connect();

       const datosFakerSanciones = [];
       const idUsuarios = await obtenerIdUsuarios();
     
       const idSanciones = [];
      const fechaActual = new Date();
      const diaActual = fechaActual.getDate();
      const mesActual = fechaActual.getMonth() + 1;
      const añoActual = fechaActual.getFullYear();
  
      for (let i = 0; i < 1; i++) {//permite la creacion de la cantidad de sanciones que se dijiten
        // Generar datos de la sanción
        do{
            var idSancion = faker.number.int({ min: 1, max: 2000 });//permite unicamente 2000 registros
        }while (idSanciones.includes(idSancion)) {
            
        }
        idSanciones.push(idSancion);
        
        const idUsuario = faker.helpers.arrayElement(idUsuarios).idUsuario;
        
       //crea aleatoriamente la informacion de el motivo de la sancion 
        const motivoSancion = faker.helpers.arrayElement(['Sancionrealizada', 'Sancionnorealizada']);
        const fechaRegistroSancion = faker.date.between({from:`${añoActual}-${mesActual}-${diaActual}`},{to:`${añoActual}-12-31`})
        


        const datosInsertar = {
          idSancion: idSancion,
          idUsuario: idUsuario,
          motivoSancion: motivoSancion,
          fechaRegistroSancion: fechaRegistroSancion
        };
  
        datosFakerSanciones.push(datosInsertar);
  
        console.log(`se han generado ${i}sanciones`)
      }
     
  
      const resultado = await cliente.db('BookWare').collection('Sanciones').insertMany(datosFakerSanciones);
  
      if (resultado) {
        console.log('Se insertaron las sanciones correctamente');
      } else {
        console.log('No se insertaron las sanciones');
      }
    } catch (e) { //estas lineas realizan la opcion de que cuando suceda un error lo muestre en la consola
      console.log(e);
    }
}

//eliminar sancion
async function eliminarSanciones() {
  const client = await MongoClient.connect(uri);
  try {
    const database = client.db('BookWare');
    const collection = database.collection('Sanciones');
    const idSancion = 1176;//se digita el id de la sancion que se desea eliminar.
    const filtro = { idSancion:idSancion }; 

    const resultado = await collection.deleteOne(filtro);

    if (resultado.deletedCount === 1) {
      console.log('la Sancion se eliminó correctamente.');
    } else {
      console.log('No se encontró ningún registro con el ID especificado.');
    }

    // Cerrar la conexión
    client.close();
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
  }
}
eliminarSanciones();


//actualizar sancion
async function actualizarSancion(idSancion, nuevosValores) {
  const cliente = new MongoClient(uri);
  
  try {
    await cliente.connect();
    
    const resultado = await cliente.db('BookWare').collection('Sanciones').updateOne(
      { idSancion: idSancion },
      { $set: nuevosValores }
    );
    
    if (resultado.modifiedCount > 0) {
      console.log(`La sanción con ID ${idSancion} ha sido actualizada`);
    } else {
      console.log(`No se encontró ninguna sanción con ID ${idSancion}`);
    }
  } catch (e) {
    console.log(e);
  } finally {
    await cliente.close();
  }
}
//unicamente realiza actualizacion a el motivo de la sancion
const idSancionActualizar = '' // ID de la sanción que deseas actualizar
const nuevosValores = {
  motivoSancion: '', // Nuevo valor para el campo motivoSancion
  fechaRegistroSancion: new Date() // Nuevo valor para el campo fechaRegistroSancion
};
//hay que recordar que estos parametros son los que permiten actualizar y insertar los nuevos valores a dicha funcion 
actualizarSancion(idSancionActualizar, nuevosValores);

//buscar sancion
async function buscarSancion(idSancion) {
  const cliente = new MongoClient(uri);

  try {
    await cliente.connect();

    const sancionEncontrada = await cliente
      .db('BookWare')
      .collection('Sanciones')
      .findOne({ idSancion: idSancion });

    if (sancionEncontrada) {
      console.log('Sanción encontrada:', sancionEncontrada);
    } else {
      console.log('No se encontró ninguna sanción con el identificador especificado.');
    }
  } catch (e) {
    console.log(e);
  } finally {
    await cliente.close();
  }
}
//busca unicamente un registro existente por su
// Llamada a la función buscarSancion()
const idSancionBuscada = ''; // ID de la sanción que deseas buscar
buscarSancion(idSancionBuscada);