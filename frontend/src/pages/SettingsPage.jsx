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

      <div className="grid grid-cols-2 gap-8 lg:grid-cols-8 mb-8">
        {THEMES.map((t) => {
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={classNames(
                "cursor-pointer border flex flex-col items-center justify-center p-5 rounded-lg gap-2 border-base-content/20 hover:border-primary transition-colors",
                { "bg-base-300": theme === t }
              )}
            >
              <div
                className="flex gap-2 bg-transparent flex-wrap items-center justify-center"
                data-theme={t}
              >
                {Array.from({ length: 5 }).map((_, i) => {
                  return (
                    <div
                      key={i}
                      className={classNames("size-4", {
                        "bg-primary": i === 0,
                        "bg-secondary": i === 1,
                        "bg-accent": i === 2,
                        "bg-neutral": i === 3,
                        "bg-info": i === 4,
                        "bg-success": i === 5,
                      })}
                    />
                  );
                })}
              </div>

              <span className="capitalize font-medium">{t}</span>
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
