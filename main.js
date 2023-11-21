const express = require('express');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = 8000;
let filename = 'notes.json';

app.use(multer().none()) 
app.use(express.json()); 
app.use(express.static('static')); // Вказуємо, що файли з папки 'static' мають бути доступні

 app.get('/', (req, res) => {
   res.sendFile(__dirname + '/static/UploadForm.html'); 
 });
// Перевірка існування файлу notes.json
if (!fs.existsSync(filename)) {
  // Якщо файл не існує, створіть порожній масив та збережіть його у файл
  fs.writeFileSync(filename, '[]', 'utf8');
}

const notes = JSON.parse(fs.readFileSync(filename, 'utf8'));
app.get('/UploadForm.html', (req, res) => {
  res.sendFile(__dirname + '/static/UploadForm.html'); 
});

  // Оновлений GET-запит для отримання нотаток
  app.get('/notes', (req, res) => {
    res.json(notes);
});

app.get('/notes/:note_name', (req, res) => {
  const note_name = req.params.note_name; // отримує значення параметру

      const findnote = notes.find(note => note.note_name === note_name); // Знаходимо нотатку за назвою
      
      if (findnote) {
        res.send({note_name: note_name, note: findnote.note});
      } else {
        res.status(404).send('JUst Nothing'); 
      }
    } );

// Оновлений posT-запит для створення нотатки Notename
app.post('/upload', (req, res) => {
  // Отримано дані з тіла запиту
  const note_name = req.body.note_name; 
  const note = req.body.note;
  
  const exiting = notes.find(note => note.note_name === note_name);

  if (exiting) {
    res.status(400).send("The note is already exist");
  } else{
    notes.push({note_name: note_name, note: note});
    fs.writeFileSync(filename, JSON.stringify(notes, null, 2), 'utf8');
    res.status(201).send("The Note has succesfully been done");
  }
});
app.put('/notes/:note_name',(req, res) => {
  const note_name = req.params.note_name; // отримує дані з параметру
  const note = req.body.note; // отримує дані з тіла запиту
    const noteIndex = notes.findIndex(note => note.note_name === note_name); // визначає індекс нотатки за введеним іменем

    if (noteIndex !== -1) { // Перевіряємо, чи існує нотатка з такою назвою
      notes[noteIndex].note = note; // Оновлюємо нотатку
      fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2), 'utf8')
      res.json({note_name: note_name,note: notes[noteIndex].note});
      res.status(200).send("Upgrade, people, upgrade!");
      
    }        
    else { 
      res.status(404).json("Just Nothing");}});

app.delete('/notes/:note_name',(req, res) => {
  const note_name = req.params.note_name; // отримує дані з параметру

  const noteIndex = notes.findIndex(note => note.note_name === note_name); // визначає індекс нотатки за введеним іменем

    if (noteIndex !== -1) { // Перевіряємо, чи існує нотатка з такою назвою
      notes.splice(noteIndex, 1); // видалення цієї нотатки

      // Зберігаємо оновлені нотатки у форматі JSON
      fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2), 'utf8'); // перетворення обєкта в рядок і додавання у файл
      res.status(200).send('Well done, soldier');
    } else {
      res.status(404).send('The note has been delete');
    }
  } );

app.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});