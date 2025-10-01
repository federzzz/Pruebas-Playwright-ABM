import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ001/CondicionPago');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/CondicionPago');

  
  console.log('Inicio de sesión exitoso');


  // actualizar pantalla
  const navCondPago = page.locator('nav:has-text("Condiciones de pago"):visible')
  const btnactualizar = navCondPago.getByTitle('Actualizar')
  await btnactualizar.click()
  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice
/*
  // Localiza el texto del segundo <td> en la primera fila, para asi obtener el codigo mas grande
  const primerafila = await page.locator('tbody tr').last().locator('td').nth(2).textContent();

  console.log(primerafila)

  // Extrae los primeros hasta 4 dígitos usando una expresión regular
  const primerosdigitos = parseInt(primerafila.match(/\d{1,4}/)[0]);
  console.log('el codigo mas grande es',primerosdigitos)

  const codnuevo = primerosdigitos+1
  console.log('el codigo nuevo es',codnuevo)
*/

  //hacemos funcion para obtener total de registros mostrados en la pantalla
async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Condiciones de pago"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}
  
  const numeroInicial = await obtenerRegistros(page);
  console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar

  const codigonuevo = 'FZ99'

  //await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  const agregar = await page.getByRole('button', { name: '+' })
  await agregar.click();

  const cod = page.getByRole('textbox', {name:'Código:'})
  const descrip = page.getByRole('textbox', {name:'Descripción:'})

  const grab = page.locator('button[title="Grabar"]').nth(2)
  await grab.click()
  
  const validacod = page.getByRole('heading', {name:'Condición de pago'})
  expect(validacod).toBeVisible()
  console.log('Se verifica correctamente validación de ingresar código')

  await page.waitForTimeout(3000)
  const btnacep = page.getByRole('button', {name:'Aceptar'})
  await btnacep.click()

  await cod.fill(codigonuevo) //registramos un codigo nuevo
  await grab.click()
  expect(validacod).toBeVisible() //arroja validación de que debe ingresar una descripción
  console.log('Se verifica correctamente validación de ingresar descripción')
  await page.waitForTimeout(3000)
  await btnacep.click()

  const nombreEsperado = 'Prueba automatizada cond pago';
  await descrip.fill(nombreEsperado)

  const descrec = page.getByRole('textbox', {name:"% Descuento/Recargo:"})
  await descrec.fill('10')

  await grab.click()
  expect(validacod).toBeVisible() //arroja validación de suma de porcentajes debe ser 100%
  console.log('Se verifica correctamente validación de suma de porcentajes debe ser 100%')
  await page.waitForTimeout(3000)
  await btnacep.click()

  const btnmas = page.getByRole('button', {name:'+'})
  await btnmas.click()

  const dias = page.getByRole('textbox', {name:'Días:'})
  const porcentaje = page.getByRole('textbox', {name:'Porcentaje:'})

  await dias.fill('30')
  await page.waitForTimeout(1000) // esperamos que se actualice la pantalla

  await porcentaje.fill('100')

  const grabarporc = page.locator('button.btn.btn-success[title="Grabar"]').nth(1)
  await grabarporc.click() //guardamos el porcentaje

  await page.waitForTimeout(3000) //esperamos 3 seg a que grabe
  await grab.click() //guardamos la condición

  await page.waitForTimeout(3000) // esperamos que se actualice la pantalla


  const nrofinal = await obtenerRegistros(page);
  console.log('Número actual de condiciones de pago registradas:', nrofinal); // Imprimir para verificar

  expect(nrofinal).toBe(numeroInicial+1)

  // SE PRUEBA MODIFICACIÓN

  const mod = navCondPago.getByTitle('Modificar')
  await mod.click()

  const nuevadescrip = 'Condición modificada'
  await descrip.fill(nuevadescrip)
  
  const nuevadescrec = '20,50'
  await descrec.fill(nuevadescrec)

  await grab.click()
  await page.waitForTimeout(3000)

  await mod.click()

  //guardamos los valores de descrip y desc rec
  
  const valorDescrip = await descrip.inputValue();
  const valorDescRec = await descrec.inputValue();


  //verificamos que la modificacion se guardo corrctamente en la descripcion y en el valor de descuento/recargo
  expect(valorDescrip).toBe(nuevadescrip)
  expect(valorDescRec).toBe(nuevadescrec)

  console.log('La condicion fue modificada exitosamente')
  

  //salimos de la condicion de pago
  const cancelar = page.locator('button.btn.btn-danger[title="Cancelar"]').nth(2)
  await cancelar.click()

  // clic boton Eliminar sobre el registro modificado
  const eliminar = navCondPago.getByTitle('Eliminar')
  await eliminar.click()

  const validaeliminar = page.getByRole('heading', {name:'Condiciones de pago'})
  expect(validaeliminar).toBeVisible()
  await page.waitForTimeout(2000)

  console.log('Se verifica correctamente validación de eliminar una condición')

  const btnsi = page.getByRole('button', {name:'Si'})
  await btnsi.click()

  await page.waitForTimeout(3000) //esperamos que se actualice ok

  const regactualizado = await obtenerRegistros(page);
  console.log('Número actual de condiciones de pago luego de eliminar:', regactualizado); // Imprimir para verificar

  expect(regactualizado).toBe(nrofinal-1)

  console.log('La condición fue eliminada exitosamente:');


});