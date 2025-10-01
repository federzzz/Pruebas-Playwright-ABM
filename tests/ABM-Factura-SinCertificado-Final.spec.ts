import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(300000); // 5 mins
  await page.goto('http://localhost/ssgWebBZ/Login/ssgBZ010%2FFactura%2FVentas');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  const btnIniciarSesion = page.getByRole('button', {name:'Iniciar sesión'})
  await btnIniciarSesion.click()
  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ010/Factura/Ventas');
  console.log('Inicio de sesión exitoso');
  
  //const botonfiltro = await page.locator('button[title="Filtros"]').nth(1);
  //const navFactVentas = page.locator('nav', {hasText:'Facturas (Ventas)'})
  const navFactVentas = page.locator('nav:has-text("Facturas (Ventas)"):visible')
  const botonfiltro = navFactVentas.getByTitle('Filtros')
  await botonfiltro.click();

  const headingFiltros = page.getByRole('heading', {name:'Filtros'})
  const modalFiltros = page.locator('div.modal-content', {has: headingFiltros})
  const contenedorEstado = modalFiltros.locator('div.col-lg-6', {hasText:'Estado'})
  const filtrofact = contenedorEstado.locator('select.form-select.form-select-sm')

  //const filtrofact = page.locator('div.col-7.mb-1 select.form-select')
  await filtrofact.selectOption('FI');

  //await page.getByRole('button', { name: 'Filtrar' }).click();
  //intentar localizar div con palabra filtros y luego localizar boton Filtrar
  const divFiltros = page.locator('div.modal-content', {hasText:'Filtros'})
  const btnFiltrar = divFiltros.getByRole('button', {name:'Filtrar'})
  await btnFiltrar.click()

  //await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

async function obtenerNumeroComprobantes(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Facturas (Ventas)"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}


  const numeroComprobantesFi = await obtenerNumeroComprobantes(page, { timeout: 15000 });
  console.log('Número actual de comprobantes en estado Finalizado:', numeroComprobantesFi); // Imprimir para verificar

  await botonfiltro.click();
  await filtrofact.selectOption('PE');
  await page.getByRole('button', { name: 'Filtrar' }).click();



const numeroComprobantes = await obtenerNumeroComprobantes(page, { timeout: 15000 });
console.log('Número actual de comprobantes pendientes:', numeroComprobantes); // Imprimir para verificar

  const btnAgregar = navFactVentas.getByRole('button', { name: '+' })
  await btnAgregar.click();
  //await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice  

  const asistente = page.getByRole('heading', {name:'Asistente para selección de comprobante'})
  expect (asistente).toBeVisible({ timeout: 15000 }); //verificamos que se visualiza correctamente el asistente

  const btncancelarasist = page.locator('button.btn.btn-danger[data-placement="top"][title="Cancelar"]').nth(0)
  await btncancelarasist.click()

  //localizamos form entero de ventas
  const formFacturaVentas = page.locator('form:has-text("Insertar facturación (ventas)"):visible');

  //localizamos form entero de modificar ventas
  const formModFacturaVentas = page.locator('form:has-text("Modificar facturación (ventas)"):visible');

  //localizamos form entero de modificar ventas
  const formCopFacturaVentas = page.locator('form:has-text("Copiar facturación (ventas)"):visible');


  const comprobante = page.getByRole('combobox', {name:'Comprobante:'})
  await comprobante.selectOption('FAVEA')
  await page.getByRole('combobox', { name: 'Estado sugerido:' }).selectOption('PE');

  // Localizar el nro de comprobante
  const camponrocomprob = formFacturaVentas.locator('input#txtComprobanteNro');

  const numerocomprob = await camponrocomprob.inputValue();
  console.log('El nro del comprobante registrado es',numerocomprob);
  
  const observaciones = page.getByRole('textbox', { name: 'Observaciones:' })
  await observaciones.fill('Prueba observacion')

  await page.getByRole('textbox', { name: 'Cliente:' }).fill('carrar');
  await page.getByRole('textbox', { name: 'Cliente:' }).press('Enter');
  await page.getByRole('tab', { name: 'Cuerpo' }).click();

  const navCuerpo = formFacturaVentas.locator('nav', {hasText:'Artículos'})
  const agregarArt = navCuerpo.getByTitle('Insertar')
  await agregarArt.click()

  //LOCALIZAMOS FORM DE INSERTAR ARTICULO OSEA DEL CUERPO
  const formCuerpo = page.locator('form', {hasText:'Insertar artículo'})


  //await page.locator('nav').filter({ hasText: 'Artículos Afectar' }).getByRole('button').first().click();
  const inputPrecio = formCuerpo.getByRole('textbox', {name:'Precio:'})
  const inputArt = formCuerpo.getByPlaceholder('Ingrese un nombre de artículo')
  await inputArt.fill('00787'); //00318
  await inputArt.press('Enter');
  const inputCant = formCuerpo.getByRole('textbox', { name: 'Cantidad:' })
  await inputCant.fill('11,00');
  await inputPrecio.fill('50')
  await inputPrecio.press('Enter')

  await agregarArt.click()
  await inputArt.fill('00724'); //00318
  await inputArt.press('Enter');
  await inputCant.fill('6');
  await inputPrecio.fill('30')
  await inputPrecio.press('Enter')

  await agregarArt.click()
  //definimos localización del check
  const checkArtSinCod = formCuerpo.getByRole('checkbox', {name:'Artículo sin código'})
  await checkArtSinCod.check()
  const inputArtSinCod = formCuerpo.locator('input#txtDescArtSinCodigo')
  await inputArtSinCod.fill('Este es un art sin codigo')
  await inputCant.fill('2')
  await inputPrecio.fill('2500')
  await inputPrecio.press('Enter')

  //definimos el nav del cuerpo
  const navFactura = formFacturaVentas.locator('nav:has-text("Insertar facturación (ventas)"):visible')

  const grabar = navFactura.getByTitle('Grabar')
  await grabar.click()
  // Esperar a que el mensaje "Procesando..." DESAPAREZCA ---
  // Le damos un timeout generoso porque esta es la operación que depende del servidor.
  const mjeProcesando = page.getByText('Procesando...')
  await expect(mjeProcesando).not.toBeVisible({ timeout: 20000 }); // 20 segundos
  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  const numeroFinal = await obtenerNumeroComprobantes(page, { timeout: 15000 });
  console.log('Número actual de comprobantes estado Pendiente con la factura recien registrada:', numeroFinal); // Imprimir para verificar
 
  // Comprobar si el número de items se incremento en 1 significando que se grabo en Pendiente correctamente
  
  expect(numeroFinal).toBe(numeroComprobantes + 1);


  //const modi = await page.getByRole('button', { name: '' }) //MODIFICAR LOCALIZADOR
  const modi = navFactVentas.getByTitle('Modificar')
  await modi.click()

  //const navFacturaMod = formModFacturaVentas.locator('nav', {hasText:'Modificar facturación (ventas)'})
  const grabarMod = formModFacturaVentas.getByTitle('Grabar')
  //modificamos la observacion

  const nuevaobs = 'Observacion modificada'
  await observaciones.fill(nuevaobs)
  await grabarMod.click()
  await expect(mjeProcesando).not.toBeVisible({ timeout: 20000 }); // 20 segundos
  // Esperar que el contenido se actualice
  //-------------------------await page.waitForTimeout(4000); 
  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  await modi.click()
  const lecturaobservacion = await observaciones.inputValue()
  console.log('La nueva observacion es: ',lecturaobservacion)

  expect(lecturaobservacion).toBe(nuevaobs)
  console.log('Se modificó el comprobante exitosamente')

  //CAMBIAMOS EL ESTADO A FINALIZADO Y GRABAMOS
  //await page.getByRole('combobox', { name: 'Estado sugerido:' }).selectOption('FI'); //ESTO REFACTORIZAR
  const EstadoSug = formModFacturaVentas.getByRole('combobox', {name:'Estado sugerido:'})
  await EstadoSug.selectOption('FI')

  /*

  //Obtencion numero de comprobante
  // Obtiene el valor del PRIMER campo de texto
  const primeraParteNroFact = formModFacturaVentas.locator('input#txtComprobante')
  const valorPrimeraParteNroFact = await primeraParteNroFact.inputValue();
  // Localizar el nro de comprobante, // Obtiene el valor del SEGUNDO campo de texto
  const contenedorNumFactParte2 = formModFacturaVentas.locator('input#txtComprobanteNro') 
  const valorSegundaParteNroFact = await contenedorNumFactParte2.inputValue(); 

  //debemos formatear la primer parte del nro ya que sino viene con 0 por delante
  const PrimeraParteFormateadaNroFact = parseInt(valorPrimeraParteNroFact, 10)
  // Une ambos valores para formar el número completo
  const numeroFactCompleto = `${PrimeraParteFormateadaNroFact}-${valorSegundaParteNroFact}`;

  console.log('El nro del comprobante registrado es',numeroFactCompleto);
  // Convertir el valor a número
  //const nroprimercomprob = parseInt(numerocomprobante, 10);

  */

  async function obtenerNumeroDeFactura(formLocator) {
  // Obtiene el valor del PRIMER campo de texto dentro del formulario recibido
  const primeraParteNroFact = formLocator.locator('input#txtComprobante');
  const valorPrimeraParteNroFact = await primeraParteNroFact.inputValue();

  // Obtiene el valor del SEGUNDO campo de texto dentro del mismo formulario
  const segundaParteNroFact = formLocator.locator('input#txtComprobanteNro'); 
  const valorSegundaParteNroFact = await segundaParteNroFact.inputValue(); 

  // Formatea la primera parte para quitar los ceros de adelante
  const primeraParteFormateada = parseInt(valorPrimeraParteNroFact, 10);

   // 2. LA LÍNEA CLAVE: Convertimos de vuelta a texto y rellenamos con ceros 
  //    hasta que tenga 4 dígitos.
  const primeraParteFormateadaFinal = String(primeraParteFormateada).padStart(4, '0'); // ej: 21 -> "0021"


  // Une ambos valores para formar el número completo
  const numeroFactCompleto = `${primeraParteFormateadaFinal}-${valorSegundaParteNroFact}`;

  // Devuelve el resultado final
  return numeroFactCompleto;
  }
  const nroFactNueva = await obtenerNumeroDeFactura(formModFacturaVentas)
  console.log('El nro del comprobante registrado es',nroFactNueva);


  await grabarMod.click() 

  // Localiza el diálogo (modal)
  const headingVerificacion = page.getByRole('heading', { name: 'Verificación de Constancias de Inscripción' })
  const VerifConstInscrip = page.locator('div.modal-content:visible', {has: headingVerificacion});
  //Sincroniza el test con la aparición del modal.
  await expect(VerifConstInscrip).toBeVisible({ timeout: 10000 });
  const btnOmitir = VerifConstInscrip.getByRole('button', { name: 'Omitir' })
  await btnOmitir.click();
  const btnACeptarConst = VerifConstInscrip.getByRole('button', { name: 'Aceptar' })
  await btnACeptarConst.click();


  await expect(mjeProcesando).not.toBeVisible({ timeout: 40000 }); // 40 segundos
  

  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  const pendientesactualizado = await obtenerNumeroComprobantes(page, { timeout: 15000 });
  console.log('Número actual de comprobantes estado Pendiente luego de haber pasado estado a Finalizar:', pendientesactualizado); // Imprimir para verificar

  expect(pendientesactualizado).toBe(numeroFinal-1)

  //vamos a filtrar los Finalizados y comprobar que aumentó en 1
  await botonfiltro.click();
  await filtrofact.selectOption('FI');
  //await page.getByRole('button', { name: 'Filtrar' }).click();
  await btnFiltrar.click()


  // Esperar que el contenido se actualice
  //await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  const FinalizadosActualizado = await obtenerNumeroComprobantes(page, { timeout: 15000 });
  console.log('Número actual de comprobantes estado Finalizado luego de haber finalizado el pendiente:', FinalizadosActualizado); // Imprimir para verificar

  expect(FinalizadosActualizado).toBe(numeroComprobantesFi+1)

  const cop = navFactVentas.getByTitle('Copiar')
  //const cop = await page.locator('button[title="Copiar"]').nth(1) //es el segundo boton ya que el 1ro arrojaba error de disabled

  //HAY QUE LOCALIZAR LA FACTURA MANUAL REGISTRADA ANTERIORMENTE **se deja aca
  const FactMa = page.getByRole('row').filter({
    has: page.getByRole('cell', {name:nroFactNueva, visible: true})})
    .filter({
      has:page.getByRole('cell',{name:'Factura "A" (Manual)'})
    })

  await FactMa.click()
  await cop.click()
  //const navFacturaCop = formCopFacturaVentas.locator('nav', {hasText:'Copiar facturación (ventas)'})
  //const navFacturaCop = formCopFacturaVentas.locator('nav:has-text("Copiar facturación (ventas)"):visible')

  const grabarCop = formCopFacturaVentas.getByTitle('Grabar')
  

  //await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice  
  //await expect(navFacturaCop).toBeVisible(); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB
  await expect(formCopFacturaVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB


  // Localizar el nro de comprobante
  //const locator2 = formCopFacturaVentas.locator('input#txtComprobanteNro')
  //const numerocomprob2 = await locator2.inputValue();
  //console.log('El nro de comprobante del copiado es',numerocomprob2);
  // Convertir el valor a número
  //const numberValuecopiado = parseInt(numerocomprob2, 10);

  const nroFactCopiada = await obtenerNumeroDeFactura(formCopFacturaVentas)
  console.log('El nro del comprobante registrado es',nroFactCopiada);   
  
  async function obtenerSiguienteNumeroFactura(numeroFactura) {
  // 1. Separamos el número en dos partes usando el guion.
  const partes = numeroFactura.split('-');
  const primeraParte = partes[0]; // "1841"
  let segundaParte = parseInt(partes[1], 10); // "00000575" se convierte en el número 575

  // 2. Le sumamos 1.
  segundaParte++; // Ahora es 576

  // 3. Volvemos a formatear la segunda parte con 8 dígitos, rellenando con ceros.
  const segundaParteFormateada = String(segundaParte).padStart(8, '0'); // 576 -> "00000576"

  // 4. Unimos todo de nuevo y lo devolvemos.
  return `${primeraParte}-${segundaParteFormateada}`;
}

  // --- CALCULAMOS CUÁL DEBERÍA SER EL SIGUIENTE NÚMERO ---
  const numeroEsperadoCopia = await obtenerSiguienteNumeroFactura(nroFactNueva); // ej: "1841-00000576"
  console.log('Número esperado para la copia:', numeroEsperadoCopia);

  //Obtenemos numero de la copia


  //verificamos que el nro comprob luego de copíar se actualizo al siguiente es decir se incremento en 1
  expect(nroFactCopiada).toBe(numeroEsperadoCopia);


  await grabarCop.press('Enter')
  await expect(VerifConstInscrip).toBeVisible({ timeout: 10000 });
  await btnOmitir.click();
  await btnACeptarConst.click();


  await expect(mjeProcesando).not.toBeVisible({ timeout: 40000 }); // 40 segundos

  // Esperar que el contenido se actualice
  //await page.waitForTimeout(4000); // Espera 4 segundos para que la página se actualice
  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  // Esperar a que el elemento <small> esté disponible
  //await page.waitForSelector('xpath=//div[10]/span/small', { timeout: 60000 });

  const numeroFinalDelCopiado = await obtenerNumeroComprobantes(page);
  console.log('Número actual de comprobantes con el copiado:', numeroFinalDelCopiado); // Imprimir para verificar


  // Comprobar si el número de items se incremento en 1 significando que se grabo en Finalizado la factura
  
  expect(numeroFinalDelCopiado).toBe(FinalizadosActualizado + 1);


  //ANULACIÓN DE LA FACTURA FINALIZADA

  //modificamos la ultima factura Finalizada
  //clickeamos boton de modificar

  
  await modi.click()

  // clicK a boton de anular
  const anu = formModFacturaVentas.getByTitle('Anular')
  //const anu = page.locator('button.btn.btn-danger.text-white[data-toggle="tooltip"][data-placement="top"][title="Anular"]');
  await anu.click()
  //confirmar anulacion
  //await page.locator('css=#myModal > div > div > form > div > div.modal-footer > button.btn.btn-primary').click()
  const ValidAnular = page.locator('div.modal-dialog', {hasText:'¿Está seguro de anular el ítem seleccionado?'}) //REFACTORIZAR
  expect(ValidAnular).toBeVisible()
  console.log('Se visualiza correctamente validación de si está seguro de anular el comprobante')

  const anularsi = await ValidAnular.getByRole('button', { name: 'Si', exact: true })
  await anularsi.click()
  await expect(mjeProcesando).not.toBeVisible({ timeout: 40000 }); // 40 segundos

  
  // Esperar que el contenido se actualice
  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB


  const numeroFinalAnul = await obtenerNumeroComprobantes(page, { timeout: 15000 });

  // Comprobar si el número de items se resto en 1 significando que se anulo la factura
    
  expect(numeroFinalAnul).toBe(numeroFinalDelCopiado - 1);

  console.log('Número final de items con el anulado:', numeroFinalAnul); // Imprimir para verificar
  

  });
  
