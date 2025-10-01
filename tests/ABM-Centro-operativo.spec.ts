import { test, expect } from '@playwright/test';
import { timeout } from 'puppeteer';


test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ001/CentroOperativo');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/CentroOperativo');

  
  console.log('Inicio de sesión exitoso');
  
  const navCentrosOperativos = page.locator('nav:has-text("Centros Operativos"):visible')

  // actualizar pantalla
  const btnActualizar = navCentrosOperativos.getByTitle('Actualizar')
  await btnActualizar.click()
  //await page.getByRole('cell', { name: 'Código ' }).locator('span').click();

  await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice

  // Localiza el texto del segundo <td> en la primera fila, para asi obtener el codigo mas grande
  //const primerafila = await page.locator('tbody tr').first().locator('td').nth(1).textContent();
  // Extrae los primeros hasta 4 dígitos usando una expresión regular
  //const primerosdigitos = parseInt(primerafila.match(/\d{1,4}/)[0]);
  //console.log('el codigo mas grande es',primerosdigitos)

  //const codnuevo = primerosdigitos+1
  const codnuevo = 'FZ99'
  // Esperar que el contenido se actualice
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  
  //hacemos funcion para obtener total de registros mostrados en la pantalla


async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Centros Operativos"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}
  
  const numeroInicial = await obtenerRegistros(page);
  console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar

  //await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice
  
  const agregar = await page.getByRole('button', { name: '+' })
  await agregar.click();

  // ingresamos en campo codigo el codigo ya existente al nuevo centro operativo, asi verificamos validación de que ya existe
  const txtboxcod = await page.getByRole('textbox', {name:'Código:'})
  //await txtboxcod.fill(primerosdigitos.toString())
  await txtboxcod.fill('7')

  const txtboxdescrip = await page.getByRole('textbox', {name:'Descripción:'})
  await txtboxdescrip.fill('nuevo')

  const grab = await page.locator('button.btn.btn-success[title="Grabar"]')
  await grab.click()

  const advertencia = await page.getByRole('heading', { name: 'Centro Operativo'})

  expect(advertencia).toBeVisible
  console.log('Se verifica validación de codigo unico de centro operativo correctamente, con el valor 7')

  await page.waitForTimeout(2000); 
  const btnAceptar = await page.getByRole('button', {name:'Aceptar'})
  await btnAceptar.click()

  // Ahora ingresamos en campo codigo el codigo nuevo del nuevo centro operativo
  await txtboxcod.fill(codnuevo.toString())

  await grab.click()

  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice


  const numerofinal = await obtenerRegistros(page);
  console.log('Número actual de registros con el nuevo centro registrado:', numerofinal); // Imprimir para verificar

  expect(numerofinal).toBe(numeroInicial+1)

  //PROCEDEMOS A MODIFICAR, boton modificar sobre el ultimo centro operativo

   
  //const mod = await page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][data-placement="top"][title="Modificar"]')
  const mod = navCentrosOperativos.getByTitle('Modificar')
  await mod.click()
  await page.waitForTimeout(2000); 

  //modificamos el codigo del centro operativo incrementandolo en 1
  //const codmodificado = codnuevo+1
  const codmodificado = 'FZ88'

  //console.log('el codigo del modificado es', codmodificado)
  await txtboxcod.fill(codmodificado)
  //grabar, luego modificar y obtener el valor
  await grab.click()
  await page.waitForTimeout(2000); // Espera 3 segundos para que la página se actualice
  await mod.click() //entramos de vuelta al registro
  const valorcodmod = await txtboxcod.inputValue();
  // verificamos valor modificado del codigo es el del incrementado en 1
  
  //expect(parseInt(valorcodmod)).toBe(codmodificado)
  expect(valorcodmod).toBe(codmodificado)

  console.log('el valor nuevo del cod. del centro es', valorcodmod)
  //cambiamos descripcion
  await txtboxdescrip.fill('modificado')
  const valorModificadoDescrip = await txtboxdescrip.inputValue()
  console.log('el nombre modificado es',valorModificadoDescrip)
  //seleccionamos tipo insumo

  await page.locator('div.ssg-input-sm select').filter({ hasText: 'No especificadoInsumoProductoAmbos' }).selectOption('coInsumo');

  await grab.click()
  await mod.click()
  const valorComprobar = await page.getByRole('textbox', {name:'Descripción:'}).inputValue()
  console.log('comprobacion de que se modifico correctamente con descripcion',valorComprobar)
  //verificamos que el nuevo valor es el de "modificado"
  expect(valorComprobar).toEqual(valorModificadoDescrip)

  // Obtener el texto visible de la opción seleccionada
  const selectedText = await page.locator('div.ssg-input-sm select option:checked').innerText();

  expect(selectedText).toBe('Insumo'); // Verifica que el texto visible sea "Insumo"
  
  //salimos del registro modificado recientemente
  const salir = await page.locator('button.btn.btn-danger[data-toggle="tooltip"][data-placement="top"][title="Cancelar"]')
  await salir.click()


  //procedemos a eliminar el centro recien creado
  //const eliminar = page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][data-placement="top"][title="Eliminar"]')
  const eliminar = navCentrosOperativos.getByTitle('Eliminar')
  await eliminar.click()
  const validac1 = page.getByRole('heading', {name:'Centros Operativos'})
  expect(validac1).toBeVisible()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  console.log('Se verifica exitosamente validación de eliminar el centro operativo')
  //click en "SI" de la validacion de eliminar para eliminar el registro
  const btnsi = page.getByRole('button', {name:'Si'})
  await btnsi.click()


  await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice

  //verificamos que se elimino 1 registro del total de centros
  const actualconelim = await obtenerRegistros(page);
  console.log('Número actual de registros con el centro eliminado:', actualconelim); // Imprimir para verificar

  expect(actualconelim).toBe(numerofinal-1)


  await page.waitForTimeout(2000); // Espera 4 segundos para que la página se actualice

  //crear hasta 1 sub-Centro Operativos y 4 Anidados

  //---------------Sub centro 1-----------------
  //agregar
  await agregar.click();
  const COPadre = page.getByRole('textbox', {name: 'Centro Operativo:'})
  //ingresamos como centro operativo padre el codigo actual mas grande
  //await COPadre.fill(primerosdigitos.toString())
  await COPadre.fill('94')

  const botonBuscar = page.locator('#cmdBuscar');
  await botonBuscar.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  //luego de hacer clic en buscar, ese codigo 94 se transforma en el nombre del centro por lo que vamos a guardarlo
  const nombrecentropadre = await COPadre.inputValue()
  await txtboxcod.fill('1')
  
  await txtboxdescrip.fill('Sub centro op')
  const nombresubcentro = await txtboxdescrip.inputValue()

  await grab.click()

  //HACEMOS EL PRIMER ANIDADO
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  await agregar.click();
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice ya que tiraba error de que no encontraba el elemento
  // en nombre del centro operativo colocamos el sub centro creado antes para que así lo pueda cargar correctamente
  await COPadre.fill(nombresubcentro)
  // Localizar el botón "buscar"
  //const botonBuscar = page.locator('#cmdBuscar');
  // Hacer clic en el botón
  await botonBuscar.click();
  await txtboxcod.fill('1')
  await txtboxdescrip.fill('Anidado 1')
  await grab.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice


  //VERIFICAMOS ANIDADO 1 RECIEN REGISTRADO
  await mod.click()
  //esperamos para que cargue
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  const centroopinput = await COPadre.inputValue()
  const codigoinput = await txtboxcod.inputValue()
  const descripinput = await txtboxdescrip.inputValue()
  
  expect(centroopinput).toBe(nombrecentropadre + '\\' + nombresubcentro);
  console.log('El path del centro operativo es', centroopinput)
  //expect(centroopinput).toBe('modificado\\Sub centro op')
  
  console.log('El codigo es', codigoinput)
  expect(codigoinput).toBe('1')
  console.log('La descripcion es', descripinput)
  expect(descripinput).toBe('Anidado 1')

  // Obtener el texto visible de la opción seleccionada
  const opselect = await page.locator('div.ssg-input-sm select option:checked').innerText();
  expect(opselect).toBe('No especificado'); // Verifica que el texto visible sea "No especificado"

  const selectedval1 = await page.locator('select.form-select.form-select-sm', { hasText: 'Costo' }).inputValue()
  expect(selectedval1).toBe('apNinguno'); // Verifica que sea el value de "No actualiza"


  //salimos del registro modificado recientemente
  await salir.click()

  //HACEMOS EL SEGUNDO ANIDADO VERIFICANDO QUE EL COD 1 YA EXISTE
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  
  await agregar.click();
  // en nombre del centro operativo colocamos el sub centro creado antes para que así lo pueda cargar correctamente
  await COPadre.fill(nombresubcentro)
  // Hacer clic en el botón
  await botonBuscar.click();
  await txtboxcod.fill('1')
  await txtboxdescrip.fill('Anidado 2')
  await grab.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  expect(advertencia).toBeVisible
  console.log('Se verifica validación de codigo unico de centro operativo correctamente')

  await page.waitForTimeout(2000); 

  await page.getByRole('button', {name:'Aceptar'}).click()
  await txtboxcod.fill('2')

  //seleccionamos tipo insumo
  //vamos al div y luego a la etiqueta select y seleccionamos insumo
  await page.locator('div.ssg-input-sm select').selectOption('coInsumo');
  await grab.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  // ingresamos al anidado 2 recien creado
  await mod.click() 

  //esperamos para que cargue
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  const centroopinput2 = await COPadre.inputValue()
  const codigoinput2 = await txtboxcod.inputValue()
  const descripinput2 = await txtboxdescrip.inputValue()
  
  expect(centroopinput2).toBe(nombrecentropadre + '\\' + nombresubcentro);
  console.log('El path del centro operativo es', centroopinput2)
  //expect(centroopinput2).toBe('modificado\\Sub centro op')
  
  console.log('El codigo es', codigoinput2)
  expect(codigoinput2).toBe('2')
  console.log('La descripcion es', descripinput2)
  expect(descripinput2).toBe('Anidado 2')

  // Obtener el texto visible de la opción seleccionada
  const opcionselec = await page.locator('div.ssg-input-sm select option:checked').innerText();
  expect(opcionselec).toBe('Insumo'); // Verifica que el texto visible sea "Insumo"

  //salimos del registro modificado recientemente
  await salir.click()

  //REGISTRAMOS 3° ANIDADO
  await agregar.click();
  // en nombre del centro operativo colocamos el sub centro creado antes para que así lo pueda cargar correctamente
  await COPadre.fill(nombresubcentro)
  // Hacer clic en el botón
  await botonBuscar.click();
  await txtboxcod.fill('3')
  await txtboxdescrip.fill('Anidado 3')
    
  //seleccionamos tipo Producto
    
  await page.locator('div.ssg-input-sm select').selectOption('coProducto');
    
  //seleccionamos en "actualiza precio" "costo y lista de todos los proveedores", localizamos el select que tiene el texto costo y seleccionamos opcion costo y lista de todos
  await page.locator('select.form-select.form-select-sm', { hasText: 'Costo' }).selectOption('apPrecioListaProveedor');
  
  //tildamos check de Valida fecha de vencimiento
  const checkfechavenc = await page.getByRole('checkbox', {name: 'Valida fecha de vencimiento'})
  await checkfechavenc.click()
  
  await grab.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice


  //VERIFICAMOS DATOS REGISTRADOS
  // ingresamos al anidado 3 recien creado
  await mod.click()

  //esperamos para que cargue
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  const centroopinput3 = await COPadre.inputValue()
  const codigoinput3 = await txtboxcod.inputValue()
  const descripinput3 = await txtboxdescrip.inputValue()
  
  expect(centroopinput3).toBe(nombrecentropadre + '\\' + nombresubcentro);
  console.log('El path del centro operativo es', centroopinput3)
  //expect(centroopinput3).toBe('modificado\\Sub centro op')
  
  console.log('El codigo es', codigoinput3)
  expect(codigoinput3).toBe('3')
  console.log('La descripcion es', descripinput3)
  expect(descripinput3).toBe('Anidado 3')
  
  // Obtener el texto visible de la opción seleccionada
  const selectedText2 = await page.locator('div.ssg-input-sm select option:checked').innerText();
  expect(selectedText2).toBe('Producto'); // Verifica que el texto visible sea "Insumo"
  
  const selectedValue2 = await page.locator('select.form-select.form-select-sm', { hasText: 'Costo' }).inputValue()
  expect(selectedValue2).toBe('apPrecioListaProveedor'); // Verifica que sea el value de "Costo y lista de todos los proveedores"
  //verifica que el checkbox esté tildado
  await expect(checkfechavenc).toBeChecked();

  //salimos del registro modificado recientemente
  await salir.click()




  //REGISTRAMOS 4° ANIDADO

  await agregar.click();
  // en nombre del centro operativo colocamos el sub centro creado antes para que así lo pueda cargar correctamente
  await COPadre.fill(nombresubcentro)
  // Hacer clic en el botón
  await botonBuscar.click();
  await txtboxcod.fill('4')
  await txtboxdescrip.fill('Anidado 4')
  
  //seleccionamos tipo Ambos
  await page.locator('div.ssg-input-sm select').selectOption('coAmbos');
  
  //seleccionamos en "actualiza precio" "costo y lista de todos los proveedores", localizamos el select que tiene el texto costo y seleccionamos opcion "Costo y lista"
  await page.locator('select.form-select.form-select-sm', { hasText: 'Costo' }).selectOption('apPrecioLista');

  //tildamos check de Valida fecha de vencimiento
  const filtradep = await page.getByRole('checkbox', {name: 'Filtra depósito del comprobante afectado'})
  await filtradep.click()


  const busqserlot = await page.getByRole('checkbox', {name: 'Habilita búsqueda de serie/lote facturación (partes)'})
  await busqserlot.click()

  await grab.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  const totalconanidados = await obtenerRegistros(page)
  console.log('El total de items ahora es de: ',totalconanidados)
  
  // ingresamos al anidado 4 recien creado
  await mod.click()

  //esperamos para que cargue
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice


  const centroopinput4 = await COPadre.inputValue()
  const codigoinput4 = await txtboxcod.inputValue()
  const descripinput4 = await txtboxdescrip.inputValue()
  
  console.log('El path del centro operativo es', centroopinput4)
  expect(centroopinput4).toBe(nombrecentropadre + '\\' + nombresubcentro)
  console.log('El codigo es', codigoinput4)
  expect(codigoinput4).toBe('4')
  console.log('La descripcion es', descripinput4)
  expect(descripinput4).toBe('Anidado 4')
  
  // Obtener el texto visible de la opción seleccionada
  const selectedText3 = await page.locator('div.ssg-input-sm select option:checked').innerText();
  expect(selectedText3).toBe('Ambos'); // Verifica que el texto visible sea "Ambos"
  
  const selectedValue3 = await page.locator('select.form-select.form-select-sm', { hasText: 'Costo' }).inputValue();
  expect(selectedValue3).toBe('apPrecioLista'); // Verifica que el texto visible sea "Insumo"

  //verifica que los checkbox esten tildados
  await expect(filtradep).toBeChecked();
  await expect(busqserlot).toBeChecked();

  //eliminación de todos los anidados y del subcentro creado
  await salir.click() //hay que salir y queda posicionado en el anidado 4 por lo que hay que ir a eliminar, luego quedas en el 3 y asi hasta borrar el subcentro op y verificar que se eliminaron 5
  await eliminar.click()
  expect(validac1).toBeVisible()
  await page.waitForTimeout(1000); // Espera 2 segundos para que la página se actualice
  console.log('Se elimina el anidado 4 exitosamente')
  //click en "SI" de la validacion de eliminar para eliminar el registro
  await btnsi.click()

  
  const fila3 = await page.locator('tr:has(td:text("Anidado 3"))'); //localizar el <tr> por el texto del <td>
  await fila3.click()
  await eliminar.click()
  expect(validac1).toBeVisible()
  await page.waitForTimeout(1000); // Espera 2 segundos para que la página se actualice
  console.log('Se elimina el anidado 3 exitosamente')
  //click en "SI" de la validacion de eliminar para eliminar el registro
  await btnsi.click()

  const fila2 = await page.locator('tr:has(td:text("Anidado 2"))'); //localizar el <tr> por el texto del <td>
  await fila2.click()
  await eliminar.click()
  expect(validac1).toBeVisible()
  await page.waitForTimeout(1000); // Espera 2 segundos para que la página se actualice
  console.log('Se elimina el anidado 2 exitosamente')
  //click en "SI" de la validacion de eliminar para eliminar el registro
  await btnsi.click()

  const fila1 = await page.locator('tr:has(td:text("Anidado 1"))'); //localizar el <tr> por el texto del <td>
  await fila1.click()
  await eliminar.click()
  expect(validac1).toBeVisible()
  await page.waitForTimeout(1000); // Espera 2 segundos para que la página se actualice
  console.log('Se elimina el anidado 1 exitosamente')
  //click en "SI" de la validacion de eliminar para eliminar el registro
  await btnsi.click()

  // 1. Localiza la fila ÚNICA que tiene la clase 'bg-primary'.
  // 2. Dentro de esa fila, busca un elemento con el rol 'cell' y el texto exacto '94.1'.
  //const filasub = page.locator('tr.bg-primary').getByRole('cell', { name: '94.1', exact: true });
  const filasub = page.getByRole('row', { name: '94.1 Sub centro op' });
  await filasub.click()
  await eliminar.click()
  expect(validac1).toBeVisible()
  await page.waitForTimeout(1000); // Espera 2 segundos para que la página se actualice
  console.log('Se elimina el sub centro exitosamente')
  //click en "SI" de la validacion de eliminar para eliminar el registro
  await btnsi.click()

  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice


  const actualizadoFinal = await obtenerRegistros(page)
  expect (actualizadoFinal).toBe(totalconanidados-5)

  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice


  
});