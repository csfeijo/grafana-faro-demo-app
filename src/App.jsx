import {
  getWebInstrumentations,
  initializeFaro,
  LogLevel,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";

const appKey = import.meta.env.VITE_FARO_APP_KEY; // Your Grafana App Id
const appName = import.meta.env.VITE_FARO_APP_ID; // Your application name

let faro = initializeFaro({
  url: `https://faro-collector-prod-sa-east-1.grafana.net/collect/${appKey}`,
  app: {
    name: appName,
    version: "1.0.0",
    environment: "production",
  },

  instrumentations: [
    // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
    ...getWebInstrumentations(),

    // Initialization of the tracing package.
    // This packages is optional because it increases the bundle size noticeably. Only add it if you want tracing data.
    new TracingInstrumentation(),
  ],
});

const handleLog = () => {
  faro.api.pushLog(
    ["Hello world", new Date().getTime()],
    { level: LogLevel.Debug },
    { skipDedupe: true }
  );
};

const handleInfo = () => {
  faro.api.pushLog(["Hello world", 123], { level: LogLevel.INFo });
};

const handleWarn = () => {
  faro.api.pushLog(["Hello world", 123], { level: LogLevel.WARN });
};

const handleError = () => {
  faro.api.pushError(new Error("[FORM] Valor invalido de campo (nome)"), {
    type: "form-validation",
    context: {
      message: "React error boundary",
    },
  });
};

const handleEvent = () => {
  faro.api.pushEvent(
    "evento-de-click",
    { formulario: "cadastro-exemplo" },
    null,
    { skipDedupe: true }
  );
};

const handleSetView = () => {
  faro.api.setView({ name: "another-route" });
};

const handleSetUser = () => {
  faro.api.resetUser();
  faro.api.setUser({
    email: "bob@example.com",
    id: "123abc",
    username: "bob",
    attributes: {
      role: "manager",
    },
  });
};

const App = () => {
  const value = {
    ripple: true,
  };

  return (
    <PrimeReactProvider value={value}>
      <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-4xl mt-4 bg-[#22272e] text-[#C5D1DE] border-2 border-[#444C56] p-2">
        <div className="grid grid-cols-12 grid-rows-10 gap-4">
          <div className="col-span-12 flex align-middle justify-center">
            <h1 className="text-3xl">Demo Grafana Faro</h1>
          </div>
          <div className="col-span-3 col-start-1 row-start-2 flex">
            <Button
              label="Set User"
              icon="pi pi-user"
              size="small"
              className="w-full"
              severity="secondary"
              onClick={handleSetUser}
            />
          </div>
          <div className="col-span-3 row-start-3 flex">
            <Button
              label="Log Default"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full"
              onClick={handleLog}
            />
          </div>
          <div className="col-span-3 col-start-1 row-start-4 flex">
            <Button
              label="Log de Info"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full"
              severity="info"
              onClick={handleInfo}
            />
          </div>
          <div className="col-span-3 col-start-1 row-start-5 flex">
            <Button
              label="Log de Warning"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full"
              severity="warning"
              onClick={handleWarn}
            />
          </div>
          <div className="col-span-3 col-start-1 row-start-6 flex">
            <Button
              label="Error"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full"
              severity="danger"
              onClick={handleError}
            />
          </div>
          <div className="col-span-3 col-start-1 row-start-7 flex">
            <Button
              label="Change View"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full"
              severity="secondary"
              onClick={handleSetView}
            />
          </div>
          <div className="col-span-3 col-start-1 row-start-8 flex">
            <Button
              label="Evento de clique"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full"
              severity="secondary"
              onClick={handleEvent}
            />
          </div>
          <div className="col-span-9 row-span-2 col-start-5 row-start-2">
            <p>Para fazer uso desse projeto corretamente, crie uma conta em{" "}
            <a
              className="text-orange-500"
              href="https://grafana.com/auth/sign-in/"
              target="_blank"
            >
              Grafana Cloud
            </a>{" "}
            e siga os passos do{" "}
            <a
              className="text-orange-500"
              href="https://github.com/csfeijo/grafana-faro-demo/blob/main/README.md"
              target="_blank"
            >
              README.md
            </a>{" "}
            desse projeto.
            </p>
            <br />
            <p>
              Observe os log´s do browser e valide se o end-point do collector está respondendo 2xx no status code.
            </p>
          </div>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default App;
