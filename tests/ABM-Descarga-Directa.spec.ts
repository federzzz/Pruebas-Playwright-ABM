import { test, expect } from '@playwright/test';
import exp from 'constants';

// --- Funciones para generar las partes del número ---
function generarPrefijo() {
  // Genera un número entre 1 y 9999 y lo rellena con ceros a la izquierda para que siempre tenga 4 dígitos
  const numero = Math.floor(Math.random() * 9999) + 1;
  return numero.toString().padStart(4, '0'); // Ejemplo: "0042"
}

// Genera un número de 8 dígitos (ej: "01846392")
function generarNumero() {
  const numero = Math.floor(Math.random() * 99999999) + 1;
  return numero.toString().padStart(8, '0');
}

test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ010/Descarga');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ010/Descarga');

  
  console.log('Inicio de sesión exitoso');
  const navDescargas = page.locator('nav', {hasText:'Descargas'})
  const botonfiltro = await navDescargas.locator('button[title="Filtros"]')
  await botonfiltro.click();
  //const filtrofact = page.locator('div.col-7.mb-1 select.form-select').nth(0)
  //await filtrofact.selectOption('FI');

  // 1. Buscamos el contenedor <div class="col-lg-6"> que tiene un <h6> con el texto exacto "Estado"
  const contenedorEstado = page.locator('div.col-lg-6:has(h6:text-is("Estado"))');
  //otra forma mas legible es:
  //const contenedorEstado = page.locator('div.col-lg-6', {has: page.getByRole('heading', { name: 'Estado', exact: true })});

  // 2. Ahora, dentro de ese contenedor único, buscamos el <select>
  const selectEstado = contenedorEstado.locator('select.form-select');

  // 3. Ejecutamos las acciones
  await selectEstado.selectOption('FI');




  
  await page.getByRole('button', { name: 'Filtrar' }).click();
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  // actualizar pantalla
  await navDescargas.locator('button[title="Actualizar"]').click();


  await page.waitForTimeout(1500); // Espera 1,5 segundos para que la página se actualice


  //hacemos funcion para obtener total de registros mostrados en la pantalla
  async function obtenerRegistros(page) {
    // Selecciona el elemento con el XPath
    const smallElement = await page.locator('xpath=//span/small').last();
    // Obtener el texto del elemento
    const contenido = await smallElement.textContent();
    // Buscar el número en el texto
    const match = contenido.trim().match(/\d+/);
    // Convertir el número a entero y devolverlo
    const numero = match ? parseInt(match[0], 10) : NaN;
    return numero;
  }
  
  const numeroInicial = await obtenerRegistros(page);
  console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar

  const agregar = await page.getByRole('button', { name: '+' })
  await agregar.click();

  await page.getByLabel('Tipo de movimiento:').selectOption('CEDT');
  await page.locator('form').filter({ hasText: 'Insertar descarga Datos' }).getByLabel('Grano:').selectOption('SJ');
  const cos = page.getByRole('textbox', { name: 'Cosecha:' })
  await cos.fill('2526')
  const comprador = page.getByRole('textbox', { name: 'Comprador:' })
  await comprador.fill('01999'); //BUNGE en TestingFZ
  await comprador.press('Enter')

  const vendedor = page.getByRole('textbox', { name: 'Vendedor:' })
  const valorvend = await vendedor.inputValue()


  // Localizamos el formulario como antes
  const formularioActivo = page.locator('form:has-text("Insertar descarga")');

  // Dentro del formulario, buscamos un <button> cuyo tipo sea "submit".
  // Es muy probable que solo haya uno por formulario.
  const botonGrabar = formularioActivo.locator('button[type="submit"][title="Grabar"]');

  // Validamos y hacemos clic
  await botonGrabar.click();
  
  const valid1 = page.getByRole('heading', {name:'Descarga'})
  expect(valid1).toBeVisible()
  console.log('Se visualiza correctamente la validación de que "No se puede finalizar el comprobante sin número de Carta de porte/Remito."')
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  const aceptar = page.getByRole('button', {name:'Aceptar'})
  await aceptar.click()

  //Generamos nro de c.porte
  const prefijo = generarPrefijo();
  const numero = generarNumero();

  const nrocp = page.getByRole('textbox',{name:'C. de porte/remito:'})
  await nrocp.fill(prefijo)

  // Paso 1: Localizamos la etiqueta exacta que nos sirve de ancla.
  const label = page.getByText('C. de porte/remito:');

  // Paso 2: A partir de la etiqueta, navegamos a su elemento "hermano" (el div que contiene los inputs)
  // y dentro de ese div, buscamos el último input.
  const nrocomp = label.locator('xpath=following-sibling::div//input').last();
  await nrocomp.fill(numero); 
  
  //otra forma es:
  // Paso 2: Usamos '..' para "subir" al elemento padre (el div.row).
  //const contenedor = label.locator('xpath=..');
  // Paso 3: Dentro de ese contenedor único, buscamos el último input.
  //const inputDeseado = contenedor.locator('input[type="text"]').last();


  const ctg = page.getByRole('textbox',{name:'C.T.G.:'})
  // Obtiene el timestamp actual en milisegundos (un número de 13 dígitos).
  const timestamp = Date.now(); 

  // Lo convierte a string y toma los últimos 11 dígitos.
  const ctgUnico = timestamp.toString().slice(-11); 
  console.log('El ctg es: ', ctgUnico)
  await ctg.fill(ctgUnico)

  const productortit = '09068' //carrario en TestingFZ , AQUI SE DEFINE LA CUENTA DEL TITULAR DE LA CARTA DE PORTE
  const titular = page.getByRole('textbox', {name:'Titular carta de porte:', exact:true})
  await titular.fill(productortit) 
  await titular.press('Enter')
  await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice
  const nombreproduc = await titular.inputValue()



  await botonGrabar.click()
  expect(valid1).toBeVisible()
  console.log('Se visualiza correctamente la validación de que "Debe digitar valor para procedencia"')
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  await aceptar.click()

  const proced = page.getByRole('textbox',{name:'Procedencia:', exact: true})
  await proced.fill('pb') //VM en testgeneral // pb en TestingFZ
  await proced.press('Enter')
  await botonGrabar.click()
  
  expect(valid1).toBeVisible()
  console.log('Se visualiza correctamente la validación de que "Debe digitar valor para destino"')
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  await aceptar.click()

  const dest = page.getByRole('textbox',{name:'Destino:', exact: true})
  await dest.fill('vinc') //puerto vicentin en testgeneral //"vinc" en TestingFZ
  await dest.press('Enter')
  await botonGrabar.click()

  expect(valid1).toBeVisible()
  console.log('Se visualiza correctamente la validación de que "Debe digitar un transportista"')
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  await aceptar.click()

  const transp = page.getByRole('textbox', {name:'Transportista:', exact: true})
  await transp.fill('01276') //01276 es depetris val. en TestingFZ
  await transp.press('Enter')

  await botonGrabar.click()
  await page.waitForTimeout(5000); // Espera 3 segundos para que la página se actualice


  const actualizados = await obtenerRegistros(page)
  expect(actualizados).toBe(numeroInicial+1)
  console.log('Número actual de registros con el recien registrado:', actualizados); // Imprimir para verificar
  

  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  //Descarga de egreso
  await page.goto('http://localhost/ssgWebBZ/ssgBZ010/DescargaEgreso');
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  const cantDescEgresos = await obtenerRegistros(page)
  console.log('La cantidad de descargas de egresos por hacer es de: ',cantDescEgresos)


  //localizamos la carta de porte registrada anteriormente con el ctg
  const descegr = await page.getByRole('cell', { name:ctgUnico})
  await descegr.click()

  const navbotones = page.locator('nav', { hasText: 'Descargas de egresos' });
  const botonMod = navbotones.getByTitle('Modificar')
  await botonMod.click()

  const brutos = page.getByRole('textbox', {name:'Kgs. bruto:'})
  await brutos.fill('45000')
  const tara = page.getByRole('textbox', {name:'Kgs. tara:'})
  await tara.fill('15000')

  //hacer clic al boton Asistente para vale
  const navModDescEgr = page.locator('nav', { hasText: 'Modificar descarga de egreso' });
  const opciones = navModDescEgr.getByTitle('Opciones')
  await opciones.click()
  const asistfletecheck = page.getByRole('checkbox', {name:'Asistente para flete'})
  await asistfletecheck.click()
  //boton de cerrar
  const opcioneslateral = page.locator('div', { hasText: 'Opciones' });
  const cerrarenopciones = opcioneslateral.getByRole('button', {name:'Cerrar'})
  await cerrarenopciones.click()
  const grabdescegr = navModDescEgr.getByTitle('Grabar')
  await grabdescegr.click()

  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  const asistenteFlete = page.getByRole('heading', {name:'Asistente para generar vale de flete'})
  expect(asistenteFlete).toBeVisible()
  const navAsistenteFlete = page.locator('nav', { hasText: 'Asistente para generar vale de flete' });
  const siguienteFlete = navAsistenteFlete.getByTitle('Siguiente')
  await siguienteFlete.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  await siguienteFlete.click()

  const dialogo = page.locator('div[role="dialog"]', {has: asistenteFlete})
  const validacionTipoTarifa = dialogo.getByText('Debe seleccionar un tipo de tarifa.');
  //verificamos que la validación muestra el mensaje
  expect (validacionTipoTarifa).toBeVisible()
   
  //verificamos que salta la validación de tipo tarifa
  console.log('Se visualiza correctamente validación de ingresar tipo de tarifa')


  await aceptar.click()
  const combotipotarifaAsisflete = page.getByRole('combobox', {name:'Tipo de tarifa'})
  await combotipotarifaAsisflete.selectOption('001')
  await siguienteFlete.click()
  // 1. Anclamos la búsqueda al formulario que contiene el título del asistente
  const asistenteFleteForm = page.locator('form', { hasText: 'Asistente para generar vale de flete' });

  // 2. Buscamos el texto de éxito DENTRO de ese formulario
  const mensajeExito = asistenteFleteForm.getByText('El asistente ha finalizado el proceso.');
  await expect(mensajeExito).toBeVisible();
  console.log('El asistente de flete ha finalizado el proceso correctamente')

  //localizamos el tilde
  const checkboxEditar=page.getByRole('checkbox', {name:'Editar el movimiento generado al salir del asistente'})
  // verifica que el check esté tildado y sino lo tilda
  await checkboxEditar.setChecked(true);

  const cerrarFlete = navAsistenteFlete.getByTitle('Cancelar')
  await cerrarFlete.click()
  
  //verificar que se va a la pantalla de modificación de flete
  //verificando contra el titulo de Modificar flete

  const navModificarFlete = page.locator('nav', {has: page.getByText('Modificar flete', { exact: true })})
  expect(navModificarFlete).toBeVisible()
  console.log('Se inicia correctamente pantalla para modificar el vale de flete')

  //cargamos cant de bultos
  const cantbultos = page.getByRole('textbox', {name:'Cant. bultos:'})
  await cantbultos.fill('5')
  const cantKms = page.getByRole('textbox', {name:'Kilometros:'})
  await cantKms.fill('350')
  const tarifaflete = page.getByRole('textbox', {name:'Tarifa:'})
  await tarifaflete.fill('2000')

  // boton Calcula flete
  const btnCalculaFlete = page.getByRole('button', {name:'Calcula flete'})
  await btnCalculaFlete.click()

  //validacion de que hay kilos y bultos
  const validFlete = page.getByRole('heading', {name:'Flete'})
  const dialogo2 = page.locator('div[role="dialog"]', {has: validFlete})
  const validacionKilosBultos = dialogo2.getByText('Se han digitado tanto kilos como bultos.');
  //verificamos que la validación muestra el mensaje
  expect (validacionKilosBultos).toBeVisible()
  console.log('Se visualiza correctamente validación de que Se han digitado tanto kilos como bultos.')

  const btnSiKilosBultos = dialogo2.getByRole('button', {name:'Si'})
  await btnSiKilosBultos.click()

  const grabarFl = navModificarFlete.locator('button[type="submit"][title="Grabar"]');
  await grabarFl.click()
  await page.waitForTimeout(5000); // Espera 5 segundos para que la página se actualice

  //const descEgreActualizado = await obtenerRegistros(page)
  //console.log('Ahora la cantidad de descargas egreso por hacer es de: ', descEgreActualizado)

  //expect(descEgreActualizado).toBe(cantDescEgresos-1)


  const asistente = page.getByRole('heading', {name:'Asistente para copia de descargas'})
  expect(asistente).toBeVisible()

  const navAsistente = page.locator('nav', { hasText: 'Asistente para copia de descargas' });
  const siguiente = navAsistente.getByTitle('Siguiente')
  await siguiente.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  //tenemos que verificar que el comprador ahora es el que antes era el vendedor en la c.p es decir 00001 y vend. el tit de la c.p
  
  //const compradorAsistente = page.getByRole('textbox', {name:'Comprador:', exact:true})
  const formularioAsistente = page.locator('form', { hasText: 'Asistente para copia de descargas' });

  const compradorAsistente = formularioAsistente.getByLabel('Comprador:');
  const valorcompradorAsist = await compradorAsistente.inputValue()

  const vendedorAsistente = formularioAsistente.getByLabel('Vendedor:')
  const valorvendedorAsist = await vendedorAsistente.inputValue()


  console.log('Ahora el comprador para el ticket de ingreso es: ', valorcompradorAsist)
  console.log('Ahora el vendedor para el ticket de ingreso es: ', valorvendedorAsist)

  expect(valorcompradorAsist).toBe(valorvend) // verificamos que el comprador del asistente es el que era vendedor de la cp

  expect(valorvendedorAsist).toBe(nombreproduc) // verificamos que el vendedor es el titular que habiamos inidcado en la cp


  const BtnFinalizar = navAsistente.getByTitle('Finalizar')
  await BtnFinalizar.click()

  await page.waitForTimeout(1500); // Espera 1.5 segundos para que la página se actualice
  
  const BtnCancelar = navAsistente.getByTitle('Cancelar')
  await BtnCancelar.click()
  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  //verificar que se va a la pantalla de modificación de descarga
  //verificando contra el titulo de Modificar descarga

  const navModificarDescarga = page.locator('nav', {has: page.getByText('Modificar descarga', { exact: true })})
  expect(navModificarDescarga).toBeVisible()
  console.log('Se inicia correctamente pantalla para modificar el ticket de ingreso')

  const grabarIngreso = navModificarDescarga.locator('button[type="submit"][title="Grabar"]');
  await grabarIngreso.click()
  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  const descEgreActualizado = await obtenerRegistros(page)
  console.log('Ahora la cantidad de descargas egreso por hacer es de: ', descEgreActualizado)

  expect(descEgreActualizado).toBe(cantDescEgresos-1)

  await page.waitForTimeout(2000); // Espera 3 segundos 


  
});
