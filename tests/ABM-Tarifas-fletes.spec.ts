import { test, expect } from '@playwright/test';
import { valueFromRemoteObject } from 'puppeteer';

test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ001/FleteTarifa');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/FleteTarifa');

  
  console.log('Inicio de sesión exitoso');

  // actualizar pantalla
  const navTarifasdeflete = page.locator('nav:has-text("Tarifas de flete"):visible')
  const btnactualizar = navTarifasdeflete.getByTitle('Actualizar')
  await btnactualizar.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  //hacemos funcion para obtener total de registros mostrados en la pantalla
async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Tarifas de flete"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}
  
  const btnfiltros = navTarifasdeflete.getByTitle('Filtros')
  await btnfiltros.click()


  const fechadesde = page.getByRole('textbox', {name:'Fecha desde:'})
  await fechadesde.fill('')

  const btnFiltrar = page.getByRole('button', {name:'Filtrar'})
  await btnFiltrar.click()
  await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice


  const numeroInicial = await obtenerRegistros(page);
  console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar

  const agregar = await page.getByRole('button', { name: '+' })
  await agregar.click();

  const grab = page.locator('button[title="Grabar"]')
  await grab.click()
  
  const validatipotar = page.getByRole('heading', {name:'Tarifas de flete'})
  expect(validatipotar).toBeVisible()
  console.log('Se verifica correctamente validación de seleccionar tipo tarifa')
  await page.waitForTimeout(2000)
  const btnacep = page.getByRole('button', {name:'Aceptar'})
  await btnacep.click()

  const valortipo = '0001' // TARIFA FLETE TONELADAS - 001 en la de testingfz
  const tipo = page.locator('select#cboGranoVariedad')
  await tipo.selectOption(valortipo)
  await page.waitForTimeout(3000)

  await grab.click()

  expect(validatipotar).toBeVisible()
  console.log('Se verifica correctamente validación de ingresar kms')
  await page.waitForTimeout(2000)
  await btnacep.click()

  const kms = page.locator('input#txtKilometros')
  const varkms = '200'
  await kms.fill(varkms)
  //await grab.click()

  //expect(validatipotar).toBeVisible()
  //console.log('Se verifica correctamente validación de seleccionar procedencia')
  //await page.waitForTimeout(2000)
  //await btnacep.click()

  const procedenciafija = 'villa mar' //pasar descrip que se quiera usar
  const proc = page.locator('input#txtNegocioProcedencia')
  await proc.fill(procedenciafija)
  const btnBuscar = page.locator('button#cmdBuscar').nth(0)
  await btnBuscar.click()
  await grab.click()
  expect(validatipotar).toBeVisible()
  console.log('Se verifica correctamente validación de seleccionar destino')
  await page.waitForTimeout(2000)
  await btnacep.click()

  const destinofijo = 'CAP' //pasar código que se quiera usar
  const dest = page.locator('input#txtNegocioDestino')
  await dest.fill(destinofijo)
  const btnBuscar2 = page.locator('button#cmdBuscar').nth(1)
  await btnBuscar2.click()
  //tarifa
  const tari = page.locator('input#txtTarifaAsfalto').nth(0)
  await tari.fill('400')

  //recupero
  const tarire = page.locator('input#txtTarifaAsfalto').nth(1)
  await tarire.fill('200')

  //obtenemos la fecha de hoy
  const fechaActual = new Date().toISOString().split('T')[0];
  const fechadesdetar = page.locator('input#dtFechaDesde')
  const fechahasta = page.locator('input#dtFechaHasta')
  await fechadesdetar.fill(fechaActual);
  await fechahasta.fill(fechaActual)
  await page.waitForTimeout(1000)

  await grab.click()
  await page.waitForTimeout(2000); // Espera 3 segundos para que la página se actualice

  const numeroFinal = await obtenerRegistros(page)
  console.log('Registros actuales: ',numeroFinal)
  expect (numeroFinal).toBe(numeroInicial+1)

  //Modificar

  //filtramos para la fecha actual
  await btnfiltros.click()
  await fechadesde.fill(fechaActual)
  await btnFiltrar.click()

  //localizamos el registro el cual seria 1 solo
  const filaUnica = page.locator('table tbody tr', {hasText:varkms});
  await filaUnica.click()

  const modificar = navTarifasdeflete.getByTitle('Modificar')
  await modificar.click()

  const nuevoskms = '300'
  const nuevatarifa = '500,00'
  await kms.fill(nuevoskms)
  await tari.fill(nuevatarifa)
  await grab.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  await modificar.click() //ingresamos al regisro de vuelta para verificar valores

  const valorkms = await kms.inputValue()
  const nuevatar = await tari.inputValue()
  console.log('Se modificaron correctamente los valores de kms a: ',valorkms, 'y el valor de la tarifa a: ',nuevatar)
  expect(valorkms).toBe(nuevoskms)
  expect(nuevatar).toBe(nuevatarifa)
  await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice

  //Eliminar registro
  const cancelar = page.locator('button[title="Cancelar"]')
  await cancelar.click()

  const eliminar = navTarifasdeflete.getByTitle('Eliminar')
  await eliminar.click()
  expect(validatipotar).toBeVisible()
  console.log('Se verifica correctamente validación de borrar el item seleccionado')
  await page.waitForTimeout(2000)
  const btnsi = page.getByRole('button', {name:'Si'})
  await btnsi.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  await btnfiltros.click()
  await fechadesde.fill('')
  await btnFiltrar.click()
  await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice



  const NumeroActualizadoFinal = await obtenerRegistros(page)
  console.log('La cantidad actual de registros es: ',NumeroActualizadoFinal)
  expect(NumeroActualizadoFinal).toBe(numeroFinal-1)

});
