import { Fragment, useState, useEffect } from 'react';
import { Model, OpenAIBaseModel } from '@/constants/openai';
import { modelToSVG, baseModelToSVG, modelToColor } from '@/utils/app/modelToSVG';

interface ModelSelectorProps {
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  conversationStarted: boolean;
}

function classNames(...classes: (false | null | undefined | string)[]) {
  return classes.filter(Boolean).join(' ')
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, setSelectedModel, conversationStarted }) => {
  const [activeButton, setActiveButton] = useState<OpenAIBaseModel | ''>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedModelSVG, setSelectedModelSVG] = useState<React.ReactNode | null>(null);
  let timeoutId: NodeJS.Timeout;

  useEffect(() => {
    const baseModel = Object.values(OpenAIBaseModel).find(base => selectedModel.startsWith(base));
    setActiveButton(baseModel || '');
    setSelectedModelSVG(modelToSVG(selectedModel, true));
  }, [selectedModel]);

  const handleMouseEnter = (baseModel: OpenAIBaseModel) => {
    clearTimeout(timeoutId);
    setActiveButton(baseModel);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
    setIsOpen(!isOpen);
    setSelectedModelSVG(modelToSVG(model, true));
  };

  const handleButtonClick = (baseModel: OpenAIBaseModel) => {
    setActiveButton(baseModel);
    setIsOpen(true);

    const defaultModel = Object.values(Model).find((model) => model.startsWith(baseModel));
    if (defaultModel) {
      setSelectedModel(defaultModel);
    }
  };

  if (conversationStarted) {
    return (
      <div className="top-0 flex flex-wrap w-screen items-center justify-center gap-1 border-b border-black/10 bg-gray-50 py-1 px-0 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">{modelToSVG(selectedModel, true)} Model: {selectedModel}</div>
    );
  } else {
    return (
      <div className="relative flex rounded-xl bg-gray-100 p-1 text-gray-900 dark:bg-gray-900" onMouseLeave={handleMouseLeave}>
        <div className="dropdown dropdown-hover">
          <ul className="flex w-full list-none sm:w-auto" onMouseEnter={() => clearTimeout(timeoutId)}>
            {Object.values(OpenAIBaseModel).map((baseModel, index) => (
              <li className="group w-full" key={baseModel}>
                <div onMouseEnter={() => handleMouseEnter(baseModel)}>
                  <button
                    onClick={() => handleButtonClick(baseModel)}
                    className={classNames(
                      'relative flex w-full sm:w-auto h-10 items-center justify-center gap-1 rounded-lg border py-3 outline-none ml-0 transition-all duration-300 sm:min-w-[148px] md:gap-0.5 md:py-2.5',
                      selectedModel.startsWith(baseModel)
                        ? 'border-black/10 bg-white text-gray-900 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] hover:!opacity-100 dark:border-[#4E4F60] dark:bg-gray-700 dark:text-gray-100'
                        : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-100',
                      activeButton === baseModel
                        ? 'opacity-100'
                        : 'opacity-75'
                    )}
                  >


                    <span className={classNames(
                      baseModel === OpenAIBaseModel.GPT3_5 ? (selectedModel.startsWith(OpenAIBaseModel.GPT3_5) ? 'text-green-300' : 'text-white') :
                        baseModel === OpenAIBaseModel.GPT4 ? (selectedModel.startsWith(OpenAIBaseModel.GPT4) ? 'text-fuchsia-500' : 'text-white') :
                          'text-green-300',
                    )}>
                      {
                        baseModel === OpenAIBaseModel.GPT3_5 ? (selectedModel.startsWith(OpenAIBaseModel.GPT3_5) ? selectedModelSVG : baseModelToSVG[baseModel]) :
                          baseModel === OpenAIBaseModel.GPT4 ? (selectedModel.startsWith(OpenAIBaseModel.GPT4) ? selectedModelSVG : baseModelToSVG[baseModel]) : baseModelToSVG[baseModel]
                      }
                    </span>
                    <span className="truncate text-sm font-semibold md:pr-1.5 pr-1.5 pl-0">{baseModel}</span>
                  </button>
                  {isOpen && activeButton === baseModel && (
                    <ul className="dropdown-content mt-0 left-0 z-[1] menu p-2 shadow bg-gray-100 dark:bg-gray-900 rounded-box w-full">                      {Object.values(Model).filter((model) => model.startsWith(activeButton)).map((model) => (
                      <li key={model} className={classNames(" flex items-start border-b border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700", model === selectedModel ? "bg-base-100 dark:bg-gray-900" : "")}
                        onClick={(e) => {
                          e.preventDefault();
                          handleModelSelect(model);
                        }}
                      >
                        <a className="py-3 px-4 rounder-xl flex items-center justify-start dark:hover:bg-transparent hover:bg-transparent dark:text-gray-400 text-center active:bg-transparent w-full">
                          <span className={classNames(model === selectedModel ? modelToColor[model as keyof typeof modelToColor] : "")}>
                            {modelToSVG(model, model === selectedModel)}
                          </span>
                          <p className="dark:text-white text-sm font-medium text-center text-gray-900">{model}</p>
                          {model === selectedModel && (
                            <span className="ml-auto text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
}

export default ModelSelector;