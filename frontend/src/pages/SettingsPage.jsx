import classNames from "classnames";
import { THEMES } from "../consts";
import { useThemeStore } from "../store/useThemeStore";
import { Headline } from "../components/Headline";

export const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="container mx-auto">
      <Headline tag="h2" className="mb-5">
        Current theme: {theme}
      </Headline>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 mb-8">
        {THEMES.map((t) => {
          return (
            <button
              key={t}
              data-theme={t}
              onClick={() => setTheme(t)}
              className={classNames(
                "cursor-pointer border-2 flex justify-center w-full rounded-lg border-base-content/20 hover:border-primary transition-colors overflow-hidden",
                { "border-primary": theme === t }
              )}
            >
              <div className="flex flex-col items-center w-1/4 shrink-0">
                <div className="bg-base-200 h-4 w-full flex-1"></div>
                <div className="bg-base-300 h-4 w-full flex-1"></div>
              </div>

              <div className="bg-base-100 w-full p-4">
                <div className="capitalize text-xs font-medium mb-2">{t}</div>

                <div className="flex gap-2 bg-transparent flex-wrap items-center justify-center">
                  {Array.from({ length: 4 }).map((_, i) => {
                    return (
                      <div
                        key={i}
                        className={classNames(
                          "flex aspect-square w-5 items-center justify-center rounded lg:w-6",
                          {
                            "bg-primary text-primary-content": i === 0,
                            "bg-secondary text-secondary-content": i === 1,
                            "bg-accent text-accent-content": i === 2,
                            "bg-neutral text-neutral-content": i === 3,
                          }
                        )}
                      >
                        А
                      </div>
                    );
                  })}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Headline tag="h2" className="mb-5">
        Preview
      </Headline>

      <div className="mb-10 max-w-2xl mx-auto rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg min-h-60 flex flex-col items-center justify-center">
        <div className="mx-auto p-4 rounded-xl w-full">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              Obi-Wan Kenobi
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">You were the Chosen One!</div>
          </div>

          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              Anakin
              <time className="text-xs opacity-50">12:46</time>
            </div>
            <div className="chat-bubble">I hate you!</div>
          </div>
        </div>
      </div>
    </div>
  );
};
