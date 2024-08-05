import {
  getWebInstrumentations,
  initializeFaro,
  LogLevel,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import DashMin from './assets/dashboard-min.png';

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
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 flex align-middle justify-center">
            <h1 className="text-3xl">Demo Grafana Faro</h1>
          </div>
          <div className="col-span-12 md:col-span-3 flex flex-col space-y-2 justify-start text-left">
            <Button
              label="Set User"
              icon="pi pi-user"
              size="small"
              className="w-full text-left"
              severity="secondary"
              onClick={handleSetUser}
            />
            <Button
              label="Log Default"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full text-left"
              onClick={handleLog}
            />
            <Button
              label="Log de Info"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full text-left"
              severity="info"
              onClick={handleInfo}
            />
            <Button
              label="Log de Warning"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full text-left"
              severity="warning"
              onClick={handleWarn}
            />
            <Button
              label="Error"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full text-left"
              severity="danger"
              onClick={handleError}
            />
            <Button
              label="Change View"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full text-left"
              severity="secondary"
              onClick={handleSetView}
            />
            <Button
              label="Evento de clique"
              icon="pi pi-chevron-right"
              size="small"
              className="w-full text-left"
              severity="secondary"
              onClick={handleEvent}
            />
          </div>
          <div className="col-span-12 row-span-2 col-start-1 md:col-start-4 md:col-span-9 flex flex-col space-y-4">
            <p>
              Para fazer uso desse projeto corretamente, crie uma conta em{" "}
              <a
                className="text-orange-500"
                href="https://grafana.com/auth/sign-in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Grafana Cloud
              </a>{" "}
              e siga os passos do{" "}
              <a
                className="text-orange-500"
                href="https://github.com/csfeijo/grafana-faro-demo/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                README.md
              </a>
            </p>
            <p>
              Observe os logs do browser e valide se o end-point do collector está respondendo <strong>2xx</strong> no status code.
            </p>
            <img src={DashMin}/>
          </div>
        </div>
        <div className="col-span-12 flex align-middle justify-center mt-10">
          <Button
            severity="contrast"
            size="small"
            onClick={() => window.open('https://professorfeijo.com.br', '_blank')}
            className="mr-2"
          >
            Professor Feijó
          </Button>
          <Button
            severity="contrast"
            size="small"
            icon="pi pi-github"
            onClick={() => window.open('https://github.com/csfeijo/grafana-faro-demo-app', '_blank')}
          />
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default App;
