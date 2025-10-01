import { test, expect } from '@playwright/test';



test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ010/Factura/Ventas');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  const btnIniciarSesion = page.getByRole('button', {name:'Iniciar sesión'})
  await btnIniciarSesion.click()

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ010/Factura/Ventas',{ timeout: 15000 });
  console.log('Inicio de sesión exitoso');

  const navFactVentas = page.locator('nav:has-text("Facturas (Ventas)"):visible')
  const botonfiltro = navFactVentas.getByTitle('Filtros')
  await botonfiltro.click();

  const headingFiltros = page.getByRole('heading', {name:'Filtros'})
  const modalFiltros = page.locator('div.modal-content', {has: headingFiltros})
  const contenedorEstado = modalFiltros.locator('div.col-lg-6', {hasText:'Estado'})
  const filtrofact = contenedorEstado.locator('select.form-select.form-select-sm')
  await filtrofact.selectOption('FI');
  
  // actualizar pantalla
  //const botonActualizar = navFactVentas.getByTitle('Actualizar')
  //await botonActualizar.click();
  const divFiltros = page.locator('div.modal-content', {hasText:'Filtros'})
  const btnFiltrar = divFiltros.getByRole('button', {name:'Filtrar'})
  await btnFiltrar.click()



async function obtenerNumeroComprobantes(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica

  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Facturas (Ventas)") ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  // Obtener el texto del elemento
  const contenido = await contadorElement.textContent();
  // Buscar el número en el texto
  const match = contenido.trim().match(/\d+/);
  // Convertir el número a entero y devolverlo
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}

const numeroInicial = await obtenerNumeroComprobantes(page, { timeout: 15000 });
console.log('Número actual de comprobantes Finalizados:', numeroInicial); // Imprimir para verificar

await botonfiltro.click();
await filtrofact.selectOption('PE');
//await page.getByRole('button', { name: 'Filtrar' }).click();
await btnFiltrar.click()


const numeroComprobantes = await obtenerNumeroComprobantes(page, { timeout: 15000 });
console.log('Número actual de comprobantes pendientes:', numeroComprobantes); // Imprimir para verificar

  const btnAgregar = navFactVentas.getByRole('button', { name: '+' })
  await btnAgregar.click();

  const asistente = page.getByRole('heading', {name:'Asistente para selección de comprobante'})
  expect (asistente).toBeVisible({ timeout: 15000 }) //verificamos que se visualiza correctamente el asistente

  const btncancelarasist = page.locator('button.btn.btn-danger[data-placement="top"][title="Cancelar"]').nth(0)
  await btncancelarasist.click()

  //localizamos form entero de ventas
  const formFacturaVentas = page.locator('form:has-text("Insertar facturación (ventas)"):visible');

  //localizamos form entero de modificar ventas
  const formModFacturaVentas = page.locator('form:has-text("Modificar facturación (ventas)"):visible');

  //localizamos form entero de modificar ventas
  const formCopFacturaVentas = page.locator('form:has-text("Copiar facturación (ventas)"):visible');


  const comprobante = page.getByRole('combobox', {name:'Comprobante:'})
  await comprobante.selectOption('FAVEAEL')
  const estadoFac = formFacturaVentas.getByRole('combobox', { name: 'Estado sugerido:' })
  const estadoFacMod = formModFacturaVentas.getByRole('combobox', { name: 'Estado sugerido:' })

  await estadoFac.selectOption('PE');

  const observaciones = page.getByRole('textbox', { name: 'Observaciones:' })
  await observaciones.fill('Prueba observacion')


  await formFacturaVentas.getByRole('textbox', { name: 'Cliente:' }).fill('carrar');
  await formFacturaVentas.getByRole('textbox', { name: 'Cliente:' }).press('Enter');
  await formFacturaVentas.getByRole('tab', { name: 'Cuerpo' }).click();

  const navCuerpo = formFacturaVentas.locator('nav', {hasText:'Artículos'})
  const agregarArt = navCuerpo.getByTitle('Insertar')
  await agregarArt.click()

  //LOCALIZAMOS FORM DE INSERTAR ARTICULO OSEA DEL CUERPO
  const formCuerpo = page.locator('form', {hasText:'Insertar artículo'})



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
  await expect(mjeProcesando).not.toBeVisible({ timeout: 50000 }); // 50 segundos
  await expect(navFactVentas).toBeVisible({ timeout: 30000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  //se graba como PENDIENTE

  const numeroFinal = await obtenerNumeroComprobantes(page, { timeout: 30000 });
  console.log('Número actual de comprobantes Pendiente con la factura recien registrada:', numeroFinal); // Imprimir para verificar


  // Comprobar si el número de items se incremento en 1 significando que se grabo en Pendiente de imprimir correctamente
  
  expect(numeroFinal).toBe(numeroComprobantes + 1);

  //modificamos la factura electrónica a Finalizada
  //clickeamos boton de modificar
 
  const modi = navFactVentas.getByTitle('Modificar')
  await modi.click()
  const grabarMod = formModFacturaVentas.getByTitle('Grabar')
  const nuevaobs = 'Observacion modificada'
  await observaciones.fill(nuevaobs)
  
  
  await estadoFacMod.selectOption('FI'); 
    // Localizar el nro de comprobante
// Obtiene el valor del PRIMER campo de texto
const primeraParte = formModFacturaVentas.getByLabel('Número interno:').nth(0)
const valorPrimeraParte = await primeraParte.inputValue();
// Obtiene el valor del SEGUNDO campo de texto
// Para el SEGUNDO input (usando el sufijo único 'ViewModelNro')
const contenedorNumInt2do = formModFacturaVentas.locator('div.row:has-text("Número interno:")');
const segundaParte =  await contenedorNumInt2do.locator('input[name$="ViewModelNro"]').inputValue();
//debemos formatear la primer parte del nro ya que sino viene con 0 por delante
const PrimeraParteFormateada = parseInt(valorPrimeraParte, 10)
// Une ambos valores para formar el número completo que buscarás
// (Asegurate de que el formato con guion sea el correcto)
const numeroInternoCompleto = `${PrimeraParteFormateada}-${segundaParte}`;


console.log('El nro interno del comprobante registrado es',numeroInternoCompleto );


  //grabar
  await grabarMod.click()
  await expect(mjeProcesando).not.toBeVisible({ timeout: 40000 }); // 40 segundos
  // Esperar que el contenido se actualice
  //-------------------------await page.waitForTimeout(4000); 
  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  
  //despues de finalizar, filtrar por finalizados y verificar la factura
  await botonfiltro.click();
  await filtrofact.selectOption('FI');
  await btnFiltrar.click()

  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  const numeroFinalFI = await obtenerNumeroComprobantes(page, { timeout: 15000 });
  console.log('Número actual de comprobantes FI con la factura recien finalizada:', numeroFinalFI); // Imprimir para verificar
  expect(numeroFinalFI).toBe(numeroInicial + 1); 

  // posiciona sobre la factura, luego ingresamos y verificamos que tenga estado "Finalizado" y visible el recuadro del certificado

  //localizamos la factura electronica recien hecha
  //const factws = await page.getByRole('cell', { name: '4. Factura "A" (WS)' }).last(); //***REFACTORIZARRRRR/
  //const factws = await page.getByRole('cell', { name:numeroInternoCompleto, visible: true})
  const factws = page.getByRole('row')
  .filter({
    has: page.getByRole('cell', { name: '4. Factura "A" (WS)' })
  })
  .filter({
    has: page.getByRole('cell', { name: numeroInternoCompleto, visible: true })
  });
  await factws.click()
  await modi.click()  

  //AQUI GUARDAR EL NRO DE FACTURA PARA LUEGO HACER EXPECT FINAL CON LA NOTA DE CRÉDITO
  
  
  // Obtiene el valor del PRIMER campo de texto
const primeraParteNroFact = formModFacturaVentas.locator('input#txtComprobante')
const valorPrimeraParteNroFact = await primeraParteNroFact.inputValue();

// Obtiene el valor del SEGUNDO campo de texto

const contenedorNumFactParte2 = formModFacturaVentas.locator('input#txtComprobanteNro')
const valorSegundaParteNroFact =  await contenedorNumFactParte2.inputValue();

//debemos formatear la primer parte del nro ya que sino viene con 0 por delante
const PrimeraParteFormateadaNroFact = parseInt(valorPrimeraParteNroFact, 10)
// Une ambos valores para formar el número completo
const numeroFactCompleto = `${PrimeraParteFormateadaNroFact}-${valorSegundaParteNroFact}`;


console.log('El nro de la factura electronica es: ', numeroFactCompleto)



// 1. Localiza el div de la fila que contiene el texto "Estado:".
//    Esto actúa como un ancla para asegurarnos de que estamos en la sección correcta.
const filaEstado = page.locator('div.row', { hasText: 'Estado:' });

// 2. Dentro de esa fila específica, busca el elemento que contiene el texto "Finalizado".
const valorEstado = filaEstado.getByText('Finalizado');

// 3. Ahora podés hacer la aserción para verificar que el estado es visible.
//    Esto confirma que la factura está en el estado correcto.
await expect(valorEstado).toBeVisible();

console.log('Verificación exitosa: El estado es "Finalizado".');
  //Verificamos que tiene el "Certificado electrónico"

  // Localiza el span con el texto "Comprobante electrónico"
  const span = await page.locator('span', { hasText: 'Comprobante electrónico' });

  // Sube al div contenedor
  const divContenedor = await span.locator('xpath=ancestor::div[@class="col border small"]');
  
  // Verifica que el div contenedor sea visible
  await expect(divContenedor).toBeVisible();


  //ANULACIÓN DE LA FACTURA Y GENERACIÓN DE Anulador Credito "A" (WS) DEJAMOS AQUI
  //const anu = page.locator('button.btn.btn-danger.text-white[data-toggle="tooltip"][data-placement="top"][title="Anular"]');
  const anu = formModFacturaVentas.getByTitle('Anular')
  await anu.click()

  //confirmar anulacion
  //await page.locator('css=#myModal > div > div > form > div > div.modal-footer > button.btn.btn-primary').click()
  const ValidAnular = page.locator('div.modal-dialog', {hasText:'¿Está seguro de anular el ítem seleccionado?'}) //REFACTORIZAR?
  expect(ValidAnular).toBeVisible()
  console.log('Se visualiza correctamente validación de si está seguro de anular el comprobante')
  // queda generado el anulador credito y al final esta la factura, la cual tiene estado Finalizado - (Anulado)
  // ahora se debe entrar a la factura y verificar que tiene el estado Finalizado - (Anulado)
  const anularsi = await ValidAnular.getByRole('button', { name: 'Si', exact: true })
  await anularsi.click()
  await expect(mjeProcesando).not.toBeVisible({ timeout: 40000 }); // 40 segundos

  // Esperar que el contenido se actualice
  await expect(navFactVentas).toBeVisible({ timeout: 15000 }); // SE AGREGA PAUSA PARA ESPERAR QUE CARGUE LA WEB

  //verificamos que se incremento en 1 la lista de comprobantes finalizados indicando que se genero el comprobante anulador
const numeroFinalconanu = await obtenerNumeroComprobantes(page, { timeout: 15000 });
console.log('Número actual de comprobantes FI con el comprobante anulador registrado:', numeroFinalconanu); // Imprimir para verificar

  expect(numeroFinalconanu).toBe(numeroFinalFI + 1);

  
  //localizamos el anulador crédito recien hecho y verificamos que tiene el estado Finalizado - (Anulador)
  // este anulador crédito tiene el mismo numero interno que la factura electronica anulada, por lo que lo podemos localizar con ese nro
  // se descubre que al levantar el visor de venta, puede venir agrupado de distintas maneras, asi que se setea de forma Sin agrupacion
  //const btnOpciones = navFactVentas.getByTitle('Opciones', { exact: true })
  //await btnOpciones.click();
  //const contra = await page.getByRole('cell', { name: 'Anulador Credito "A" (WS)' }).last();
  const contra = page.getByRole('row')
  .filter({
    has: page.getByRole('cell', { name: 'Anulador Credito "A" (WS)' })
  })
  .filter({
    has: page.getByRole('cell', { name: numeroInternoCompleto })
  });
  await contra.click()


  await modi.click()  
  
  const spananulador = await page.locator('div.col-auto.ms-auto.align-self-center > span');
  await spananulador.waitFor() //esperamos a que el span este visible
  const textspananulador = await spananulador.textContent();
  const formateadoanulador = textspananulador?.trim()

  console.log('El estado del comprobante anulador es', formateadoanulador)
  //verificamos que está finalizada correctamente con estado Finalizado  - (Anulador)
  expect(formateadoanulador).toBe('Finalizado  - (Anulador)');


  //ahora vamos a ir a la ficha "Comprobantes"

  const fichacomprob = await page.getByRole('tab', { name: 'Comprobantes (Relac.)'})
  await fichacomprob.click()


  const facturaafect = await page.getByRole('cell', { name: '4. Factura "A" (WS)' })
  await facturaafect.click()

  //presionar enter para poder acceder y guardar numero de la factura asociada
  await facturaafect.press('Enter')


  // Localizar el input usando tanto la clase como el placeholder y obtener su valor
  //const nroinputfact = page.locator('input.form-control.form-control-sm[placeholder="Ingrese un número de comprobante para buscar..."]');
  const nroinputfact = page.locator('input.form-control.form-control-sm[placeholder="Ingrese un número de comprobante para buscar..."]');
  const valorInput = await nroinputfact.inputValue();
  
  // Extraer el número después del guion y eliminar ceros a la izquierda
  //const numero = parseInt(valorInput.split('-').pop(), 10); // Convierte a número, eliminando ceros a la izquierda
  console.log('Número de la factura afectada en el anulador:', valorInput);

  //verificamos que el numero de la factura afectada en el comprob. anulador es igual al nro de la factura electronica que guardamos anteriormente cuando la registramos
 
  expect(valorInput).toBe(numeroFactCompleto);
  


});


