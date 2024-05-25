const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const path = require('path');

const app = express();
//El password lo guarde hasheado, porque así es como se almacenan las contraseñas de una forma segura, password: hola123
const users = [{email : "javier@gmail.com", password : '$2a$10$86i/9N3juBxjphw47OBaneP8nOCbAv/npR7F5pbA1Uswq7zEhhJuC'}];

app.use(session({
  secret: 'llave-secreta',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Inicializamos express-static para servir archivos estáticos desde la carpeta 'public'
// todos los archivos staticos se guardaran aca (css, js,img)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el archivo HTML el cual tiene el formulario del registro
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

//End point que ayuda a registrar al usuario (email, password)
app.post('/api/registro', async (req, res) => {
  
  const correo = req.body.correo;
  const password = req.body.password;
  
//Si se encuentra un mail igual al que se estan ingresando esta variable pasa a tener un valor verdadero
  const userExists = users.some(user => user.email === correo);

//si la variable es verdadera, se muestra un msj de que este mail ya exite
  if (userExists) {
    console.log('Este mail ya existe');
    return res.status(400).send('Este mail ya existe');
// si la variable es falsa entonces se encrypta el password y se crea un nuevo user
//el cual lo suma a la lista users que es la variable donde los estamos almancenado    
  }else{ const salt = await bcryptjs.genSalt(10);
    const passHash = await bcryptjs.hash(password, salt);
    const newUser = {email : correo, password : passHash}
    users.push(newUser);
  }

  console.log(users)

  res.status(201).send('Usuario creado');
});

//Ruta para el archivo HTML el cual tiene el formulario de inicio de sesión
app.get('/login', async (req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


//Este endpoint atrapa los datos ingresados en formulario
app.post('/api/login', async (req, res) => {
  const correo = req.body.correo;
  const password = req.body.password;

  // Verifica si el usuario existe en la lista users, si existe la variable pasa a ser verdadera
  const user = users.find(user => user.email === correo);

  // si la variable No es verdadera, entonces imprime 'usuario no encontrado' y lo redireciona
  if (!user) {
    console.log('Usuario no encontrado');
    return res.status(400).redirect('/form');
  }
  // Si existe se Verifica la contraseña si es correcta
  const isMatch = await bcryptjs.compare(password, user.password);

  //sino es correcta se imprime 'Contraseña incorrecta'
  if (!isMatch) {
    console.log('Contraseña incorrecta');
    return res.status(400).send('Contraseña incorrecta');
  }
  
  // Y la contraseñas coicinden se dice que la autenticación fue exitosa
  console.log('Usuario autenticado');
  res.status(200).send('Usuario autenticado');
});



app.get('/public-classes', (req, res) => {
    res.json({ classes: ['Hell HIIT', 'Instant crush', 'Lava Tone', 'Drills n Tricks', 'Calisthenics - ft. Bar Bros'] });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor local expuesto en: http://localhost:${PORT}`));