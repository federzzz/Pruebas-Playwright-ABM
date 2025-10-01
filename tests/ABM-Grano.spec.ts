import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ001/Grano');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/Grano');

  
  console.log('Inicio de sesión exitoso');

  await page.waitForTimeout(1500); // Espera 1,5 segundos para que la página se actualice
  const navGranos = page.locator('nav:has-text("Granos"):visible')
  

  //hacemos funcion para obtener total de registros mostrados en la pantalla
async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Granos"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}
  
  const numeroInicial = await obtenerRegistros(page);
  console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar

  const codigoexistente = 'SJ'
  const codigonuevo = 'FZ'
  const descripcion = 'GRANO FZ'
  
  const cose = '2526'
  //await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  const agregar = await page.getByRole('button', { name: '+' })
  await agregar.click();

  const cod = page.locator('div .ssg-input-sm input.form-control.form-control-sm').nth(0)
  const descrip = page.locator('div.col-md-6 input.form-control.form-control-sm')

  const grab = page.locator('button[title="Grabar"]')
  await grab.click()
  
  const validacod = page.getByRole('heading', {name:'Grano'})
  expect(validacod).toBeVisible()
  console.log('Se verifica correctamente validación de ingresar código')

  await page.waitForTimeout(3000)
  const btnacep = page.getByRole('button', {name:'Aceptar'})
  await btnacep.click()

  await cod.fill(codigoexistente) //registramos un codigo ya existente
  await grab.click()
  expect(validacod).toBeVisible() //arroja validación de ingresar descrip
  console.log('Se verifica correctamente validación de ingresar descripción')
  await page.waitForTimeout(3000)
  await btnacep.click()

  await descrip.fill(descripcion)
  await grab.click()
  expect(validacod).toBeVisible() //arroja validación de que hay un codigo ya usado
  console.log('Se verifica correctamente validación de que ya hay un código',codigoexistente,'siendo usado')
  await page.waitForTimeout(3000)
  await btnacep.click()


  await cod.fill(codigonuevo) //registramos un codigo nuevo

  const cos = page.locator('div .ssg-input-sm input.form-control.form-control-sm').nth(1)
  await cos.fill(cose)

  const valorvar = '001' //es la General
  const varsug = page.locator('select#cboGranoVariedad')
  await varsug.selectOption(valorvar)

  const onc = '23' //oncca de soja
  const codonc = page.locator('select#cboCodSagpya')
  await codonc.selectOption(onc)

  const valorderonc = '221'
  //const derivonc = page.locator('select#cboOnccaDerivadoGrano')
  //await derivonc.selectOption(valorderonc)

  const valortipo = 'tCereal' //Cereal
  const tipo = page.locator('select#cboTipoGrano')
  await tipo.selectOption(valortipo)

  const valortipograonc = '0' //Unico
  const tipogron = page.locator('select#cboTipoGranoOncca')
  await tipogron.selectOption(valortipograonc)

  const dnrp = page.locator('div .ssg-input input.form-control.form-control-sm').nth(0)
  await dnrp.fill('12345678987654321789') 

  const bonificacion = page.locator('input#txtCotizadorCuerpoValor').nth(0)
  const rebaja = page.locator('input#txtCotizadorCuerpoValor').nth(1)

  await bonificacion.fill('1')
  await rebaja.fill('-1,50')

  const arti = '0000014' //articulo a buscar
  const art = page.locator('input#txtLocalidadOncca')
  await art.fill(arti)
  const btnbusc = page.locator('button#cmdBuscar')
  await btnbusc.click()
  await page.waitForTimeout(1000) //esperamos 1 seg a que se cargue

  const marcagradofact = page.locator('input#chkEditaGradoFactor')
  await marcagradofact.check()

  const marcainfind = page.locator('input#chkInformaIndustria')
  await marcainfind.check()

  const obs = page.locator('textarea#txtObservaciones')
  await obs.fill('Esto es una prueba')

  await grab.click()
  await page.waitForTimeout(2000) //esperamos 2 seg a que grabe

  const nrofinal = await obtenerRegistros(page);
  console.log('Número actual de granos registrados:', nrofinal); // Imprimir para verificar

  expect(nrofinal).toBe(numeroInicial+1)

  // SE PRUEBA MODIFICACIÓN

  const mod = navGranos.getByTitle('Modificar')
  await mod.click()

  const nuevadescrip = 'GRANO FZ AUTOMAT'
  await descrip.fill(nuevadescrip)

  const valorvar2 = '001' //es la UNICA
  await varsug.selectOption(valorvar2)

  await grab.click()
  await page.waitForTimeout(2000)

  await mod.click()

  //guardamos los valores de descrip y desc rec
  
  const valorDescrip = await descrip.inputValue();
  const valorSuger = await varsug.inputValue();


  //verificamos que la modificacion se guardo corrctamente en la descripcion y en el valor de descuento/recargo
  expect(valorDescrip).toBe(nuevadescrip)
  expect(valorSuger).toBe(valorvar2)

  console.log('El grano fue modificado exitosamente')
  

  //salimos del grano
  const cancelar = page.locator('button.btn.btn-danger[title="Cancelar"]')
  await cancelar.click()

  // clic boton Eliminar sobre el registro modificado
  const eliminar = navGranos.getByTitle('Eliminar')
  await eliminar.click()

  const validaeliminar = page.getByRole('heading', {name:'Granos'})
  expect(validaeliminar).toBeVisible()
  await page.waitForTimeout(2000) //esperamos que se actualice ok

  console.log('Se verifica correctamente validación de eliminar una condición')

  const btnsi = page.getByRole('button', {name:'Si'})
  await btnsi.click()

  await page.waitForTimeout(2000) //esperamos que se actualice ok

  const regactualizado = await obtenerRegistros(page);
  console.log('Número actual de granos luego de eliminar:', regactualizado); // Imprimir para verificar

  expect(regactualizado).toBe(nrofinal-1)

  console.log('El grano fue eliminado exitosamente');


});
