import { Container, Card } from "react-bootstrap"

function TerminosCondiciones() {
  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Términos y Condiciones</h2>

          <p>
            Al contratar los servicios de <strong>Buen Aseo SpA</strong>, el cliente
            acepta los siguientes términos y condiciones. Estos aplican para todos los
            servicios realizados en las ciudades de <strong>Coquimbo y La Serena</strong>.
          </p>

          <h5 className="mt-4">1. Servicios</h5>
          <p>
            Buen Aseo SpA ofrece servicios de limpieza domiciliaria, limpieza profunda y
            servicios asociados a arriendos tipo Airbnb. Cada servicio tiene una duración
            máxima definida y un alcance específico según lo contratado.
          </p>

          <h5 className="mt-4">2. Duración del servicio</h5>
          <p>
            Los servicios de limpieza tienen una duración máxima de hasta <strong>4 horas</strong>,
            salvo que se indique lo contrario. Si el inmueble presenta condiciones fuera
            de lo normal, el servicio podrá ajustarse o requerir un cobro adicional.
          </p>

          <h5 className="mt-4">3. Acceso al inmueble</h5>
          <p>
            El cliente es responsable de facilitar el acceso al inmueble en la fecha y
            horario acordados. Retrasos o imposibilidad de ingreso podrán ser considerados
            como servicio realizado.
          </p>

          <h5 className="mt-4">4. Reprogramaciones y cancelaciones</h5>
          <p>
            Las cancelaciones o cambios de horario deben informarse con al menos
            <strong> 24 horas de anticipación</strong>. Cancelaciones fuera de este plazo
            podrán no ser reembolsables.
          </p>

          <h5 className="mt-4">5. Responsabilidad</h5>
          <p>
            Buen Aseo SpA se compromete a realizar el servicio con cuidado y profesionalismo.
            No se hace responsable por objetos de alto valor que no hayan sido retirados
            previamente o informados antes del servicio.
          </p>

          <h5 className="mt-4">6. Productos y materiales</h5>
          <p>
            Los productos utilizados son de uso doméstico y profesional. El cliente debe
            informar previamente si existen superficies delicadas o restricciones
            específicas.
          </p>

          <h5 className="mt-4">7. Aceptación</h5>
          <p>
            Al contratar un servicio, el cliente declara haber leído y aceptado estos
            términos y condiciones.
          </p>

          <p className="text-muted mt-4">
            Última actualización: 2026
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default TerminosCondiciones
