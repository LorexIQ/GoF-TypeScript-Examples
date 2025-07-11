/* GOF Patterns */

namespace GOFPatterns {
  export namespace Creational {
    export namespace FactoryMethod {
      class Box<T> {
        private constructor(private _value: T) { }

        static of<T>(value: T) {
          return new Box(value);
        }

        get value() {
          return this._value;
        }
      }

      export function test() {
        const box = Box.of(123);
        console.log(`[Box]: ${box.value}`);
      }
    }
    export namespace AbstractFactory {
      abstract class Element {
        render() {
          console.log(`${this.constructor.name} rendered`);
        }
      }

      class Button extends Element { }
      class Input extends Element { }
      class GUI {
        getButton() {
          return new Button();
        }
        getInput() {
          return new Input();
        }
      }

      export function test() {
        const gui = new GUI();
        const button = gui.getButton();
        const input = gui.getInput();

        button.render();
        input.render();
      }
    }
    export namespace Builder {
      type BunType = 'white' | 'black';
      type MeatType = 'beef' | 'chicken';

      class Burger {
        constructor(
          private bun: BunType,
          private meat: MeatType,
          private onion: boolean,
          private cheese: boolean
        ) { }
      }
      class BurgerBuilder {
        private bun: BunType = 'white';
        private meat: MeatType = 'beef';
        private onion: boolean = false;
        private cheese: boolean = false;

        setBun(bun: BunType) {
          this.bun = bun;
          return this;
        }
        setMeat(meat: MeatType) {
          this.meat = meat;
          return this;
        }
        setOnion() {
          this.onion = true;
          return this;
        }
        setCheese() {
          this.cheese = true;
          return this;
        }
        build() {
          return new Burger(
            this.bun,
            this.meat,
            this.onion,
            this.cheese
          );
        }
      }

      export function test() {
        const burgerBuilder = new BurgerBuilder();
        const burger = burgerBuilder
          .setMeat('chicken')
          .setCheese()
          .build();

        console.log(burger);
      }
    }
    export namespace Prototype {
      let incrementalId = 0;

      class UserCard {
        private id = ++incrementalId;

        constructor(
          private firstName: string,
          private secondName: string,
          private age: number
        ) { }



        clone() {
          return new UserCard(
            this.firstName,
            this.secondName,
            this.age
          );
        }
      }

      export function test() {
        const userCard = new UserCard('Дмитрий', 'Мурашко', 22);
        const userCardClose = userCard.clone();

        console.log(userCard);
        console.log(userCardClose);
      }
    }
    export namespace Singleton {
      class Randomizer {
        private static instance?: Randomizer;
        private value = Math.random();

        constructor(singleton = true) {
          if (singleton && Randomizer.instance) {
            return Randomizer.instance;
          } else {
            Randomizer.instance = this;
          }
        }

        getValue() {
          return this.value;
        }
      }

      export function test() {
        const value1 = new Randomizer(false);
        const value2 = new Randomizer(false);
        const value3 = new Randomizer(false);

        console.log(
          'Non Singleton:',
          value1.getValue(),
          value2.getValue(),
          value3.getValue()
        );

        const valueS1 = new Randomizer();
        const valueS2 = new Randomizer();
        const valueS3 = new Randomizer();

        console.log(
          'Singleton:',
          valueS1.getValue(),
          valueS2.getValue(),
          valueS3.getValue()
        );
      }
    }
  }
  export namespace Structural {
    export namespace Adapter {
      class ForkB {
        connect3Pin() {
          console.log('Fork B connected');
        }
      }
      class ForkC {
        connect2Pin() {
          console.log('Fork C connected');
        }
      }
      class AdapterForkBToC implements ForkC {
        constructor(private forkB: ForkB) { }

        connect2Pin() {
          console.log('Use fork B->C adapter');
          return this.forkB.connect3Pin();
        }
      }
      class PlugC {
        constructor(private fork: ForkC) { }

        turnOn() {
          console.log('Fork connecting...');
          this.fork.connect2Pin();
        }
      }

      export function test() {
        const forkB = new ForkB();
        const forkC = new ForkC();
        const plugC1 = new PlugC(forkC);
        const plugC2 = new PlugC(new AdapterForkBToC(forkB));

        plugC1.turnOn();
        plugC2.turnOn();
      }
    }
    export namespace Bridge {
      const minmax = (min: number, current: number, max: number) => Math.max(min, Math.min(current, max));

      class TV {
        protected brigtness = 50;
        protected volume = 50;

        setBrightness(brigtness: number) {
          this.brigtness = minmax(0, brigtness, 100);
        }
        setVolume(volume: number) {
          this.volume = minmax(0, volume, 100);
        }

        getBrightness() {
          return this.brigtness;
        }
        getVolume() {
          return this.volume;
        }
      }
      class SmartTV extends TV {
        private versionOS = '1.2.923';

        checkUpdates() {
          console.log('The latest software version is being used');
        }

        getVersionOS() {
          return this.versionOS;
        }
      }
      class OldRemoteController {
        constructor(protected tv: TV, protected step = 5) { }

        brightnessUp() {
          this.tv.setBrightness(this.tv.getBrightness() + this.step);
        }
        brightnessDown() {
          this.tv.setBrightness(this.tv.getBrightness() - this.step);
        }
        volumeUp() {
          this.tv.setVolume(this.tv.getVolume() + this.step);
        }
        volumeDown() {
          this.tv.setVolume(this.tv.getVolume() - this.step);
        }
      }
      class NewRemoteController extends OldRemoteController {
        constructor(override tv: SmartTV, step = 5) {
          super(tv, step);
        }

        updateOS() {
          this.tv.checkUpdates();
        }
      }

      export function test() {
        const tv = new TV();
        const smartTV = new SmartTV();
        const oldRemoteController1 = new OldRemoteController(tv, 10);
        const oldRemoteController2 = new OldRemoteController(smartTV, 5);
        const newRemoteController = new NewRemoteController(smartTV, 1);

        oldRemoteController1.volumeUp();
        oldRemoteController1.volumeUp();
        console.log(tv.getVolume());

        oldRemoteController2.brightnessDown();
        oldRemoteController2.brightnessDown();
        console.log(smartTV.getBrightness());

        newRemoteController.updateOS();
      }
    }
    export namespace Composite {
      class File {
        constructor(
          protected name: string,
          protected type: string
        ) { }

        print() {
          console.log(`${this.name}.${this.type}`);
        }
      }
      class Folder extends File {
        private files: File[] = [];

        constructor(name: string) {
          super(name, 'folder');
        }

        addFile(file: File) {
          this.files.push(file);
          return this;
        }
      }

      export function test() {
        const rootFolder = new Folder('root');
        const allianceFolder = new Folder('alliance');

        rootFolder.addFile(allianceFolder);
        allianceFolder.addFile(new File('access denied', 'txt'));

        console.log(rootFolder);
      }
    }
    export namespace Decorator {
      class Coffee {
        cost() {
          return 70;
        }
      }

      class CappuccinoCoffeeDecorator implements Coffee {
        constructor(private coffee: Coffee) { }

        cost() {
          return this.coffee.cost() + 20;
        }
      }
      class LatteCoffeeDecorator implements Coffee {
        constructor(private coffee: Coffee) { }

        cost() {
          return this.coffee.cost() + 30;
        }
      }

      export function test() {
        const coffee = new Coffee();
        const cappuccinoCoffee = new CappuccinoCoffeeDecorator(coffee);
        const latteCoffee = new LatteCoffeeDecorator(coffee);

        console.log(
          'Costs:',
          coffee.cost(),
          cappuccinoCoffee.cost(),
          latteCoffee.cost()
        );
      }
    }
    export namespace Facade {
      abstract class PCElement {
        init() {
          console.log(`${this.constructor.name} test complete. Inited!`);
        }
      }
      class CPU extends PCElement { }
      class GPU extends PCElement { }
      class RAM extends PCElement { }
      class BIOS extends PCElement { }
      class PC {
        private cpu = new CPU();
        private gpu = new GPU();
        private ram = new RAM();
        private bios = new BIOS();

        run() {
          this.cpu.init();
          this.gpu.init();
          this.ram.init();
          this.bios.init();
          console.log('PC is running');
        }
      }

      export function test() {
        const pc = new PC();
        pc.run();
      }
    }
    export namespace Flyweight {
      let incrementalId = 0;

      class PixelColor {
        private id = ++incrementalId;

        constructor(
          private readonly red: number,
          private readonly green: number,
          private readonly blue: number,
        ) { }
      }
      class PixelColorFactory {
        private colorsMap = new Map<string, PixelColor>();

        getColor(red: number, green: number, blue: number) {
          const uuid = `${red}_${green}_${blue}`;
          let color = this.colorsMap.get(uuid);

          if (!color) {
            color = new PixelColor(
              red,
              green,
              blue
            );
            this.colorsMap.set(uuid, color);
          }

          return color;
        }
      }

      export function test() {
        const pixelColorFactory = new PixelColorFactory();

        console.log(pixelColorFactory.getColor(0, 0, 0));
        console.log(pixelColorFactory.getColor(0, 0, 0));
        console.log(pixelColorFactory.getColor(255, 0, 0));
        console.log(pixelColorFactory.getColor(255, 255, 0));
        console.log(pixelColorFactory.getColor(255, 255, 255));
      }
    }
    export namespace Proxy {
      class Service {
        getData(prefix: string) {
          let lastValue = 0;

          for (let i = 0; i < 1e9; i++) {
            lastValue = Math.random();
          }

          return `${prefix}:${lastValue}`;
        }
      }
      class CacheService implements Service {
        private cache = new Map();

        constructor(private service: Service) { }

        getData(prefix: string) {
          const uuid = `getData:${prefix}`;
          let cacheValue = this.cache.get(uuid);

          if (!cacheValue) {
            cacheValue = this.service.getData(prefix);
            this.cache.set(uuid, cacheValue);
          }

          return cacheValue;
        }
      }

      export function test() {
        const service = new Service();
        const cacheService = new CacheService(service);

        let speedtest = createSpeedTest();
        console.log(cacheService.getData('1'));
        speedtest();

        speedtest = createSpeedTest();
        console.log(cacheService.getData('1'));
        speedtest();

        speedtest = createSpeedTest();
        console.log(cacheService.getData('2'));
        speedtest();

        speedtest = createSpeedTest();
        console.log(cacheService.getData('2'));
        speedtest();
      }
    }
  }
  export namespace Behavioral {
    export namespace ChainOfResponsibility {
      class Middleware {
        protected next?: Middleware;

        protected handleNext(req: string) {
          this.next?.handle(req);
        }

        setNext(middleware: Middleware) {
          this.next = middleware;
          return middleware;
        }
        handle(req: string) {
          if (this.next) this.next.handle(req);
        }
      }
      class AuthMiddleware extends Middleware {
        handle(req: string) {
          if (!req.startsWith('auth')) throw new Error('Unauthorized user');
          else this.handleNext(req);
        }
      }
      class RoleMiddleware extends Middleware {
        constructor(private name: string) {
          super();
        }

        handle(req: string) {
          if (!req.endsWith(this.name)) throw new Error('No access');
          else this.handleNext(req);
        }
      }

      export function test() {
        const guestMiddleware = new Middleware();
        guestMiddleware
          .setNext(new RoleMiddleware('guest'));
        const authAdminMiddleware = new Middleware();
        authAdminMiddleware
          .setNext(new AuthMiddleware())
          .setNext(new RoleMiddleware('admin'));

        tryHandler(() => {
          guestMiddleware.handle('unauth:guest');
          console.log('Guest received content! [1]');
        });
        tryHandler(() => {
          authAdminMiddleware.handle('unauth:guest');
          console.log('Guest received content! [2]');
        });
        tryHandler(() => {
          authAdminMiddleware.handle('auth:user');
          console.log('User received content!');
        });
        tryHandler(() => {
          authAdminMiddleware.handle('auth:admin');
          console.log('Admin received content!');
        });
      }
    }
    export namespace Command {
      interface Command {
        execute(): void;
        undo(): void;
      }

      class Light {
        constructor(private _status = false) { }

        get status() {
          return this._status;
        }

        turnOn() {
          this._status = true;
        }
        turnOff() {
          this._status = false;
        }
      }
      class LightTurnOnCommand implements Command {
        constructor(private light: Light) { }

        execute() {
          this.light.turnOn();
        }
        undo() {
          this.light.turnOff();
        }
      }
      class LightTurnOffCommand implements Command {
        constructor(private light: Light) { }

        execute() {
          this.light.turnOff();
        }
        undo() {
          this.light.turnOn();
        }
      }
      class LightHistory {
        private history: Command[] = [];

        press(command: Command) {
          command.execute();
          this.history.push(command);
        }
        undo() {
          this.history.pop()?.undo();
        }
      }

      export function test() {
        const light = new Light();
        const lightTurnOn = new LightTurnOnCommand(light);
        const lightTurnOff = new LightTurnOffCommand(light);
        const lightHistory = new LightHistory();

        lightHistory.press(lightTurnOn);
        console.log(`[Light]: (${light.status})`);
        lightHistory.press(lightTurnOff);
        console.log(`[Light]: (${light.status})`);

        lightHistory.undo();
        console.log(`[Light]: (${light.status})`);
        lightHistory.undo();
        console.log(`[Light]: (${light.status})`);
      }
    }
    export namespace Interpreter {
      interface Expression {
        interpret(): any;
      }

      class NumberExpression implements Expression {
        constructor(private value: number) { }

        interpret() {
          return this.value;
        }
      }
      class AddExpression implements Expression {
        constructor(
          private left: Expression,
          private right: Expression
        ) { }

        interpret() {
          return this.left.interpret() + this.right.interpret();
        }
      }
      class SubExpression implements Expression {
        constructor(
          private left: Expression,
          private right: Expression
        ) { }

        interpret() {
          return this.left.interpret() - this.right.interpret();
        }
      }
      class MultiplyExpression implements Expression {
        constructor(
          private left: Expression,
          private right: Expression
        ) { }

        interpret() {
          return this.left.interpret() * this.right.interpret();
        }
      }

      export function test() {
        const left = new AddExpression(
          new NumberExpression(4),
          new NumberExpression(6)
        );
        const right = new SubExpression(
          new NumberExpression(4),
          new NumberExpression(2)
        );

        const expression = new MultiplyExpression(
          left,
          right
        );

        console.log(expression.interpret());
      }
    }
    export namespace Iterator {
      class ClosedArray<T> {
        private currentIndex = 0;

        constructor(private items: T[]) { }

        current() {
          return this.items[this.currentIndex];
        }
        next() {
          if (this.items.length <= this.currentIndex + 1) return null;
          else return this.items[this.currentIndex++];
        }
      }

      export function test() {
        const array = new ClosedArray([1, 2, 3, 4, 5]);

        do {
          console.log(array.current());
        } while (array.next())
      }
    }
    export namespace Mediator {
      type UserEvents = {
        'message': {
          user: User;
          message: string;
        }
      };

      class Chat {
        private users = new Set<User>();

        addUser(user: User) {
          this.users.add(user);
          user.connectToChat(this);
          return this;
        }
        kickUser(user: User) {
          if (this.users.delete(user)) {
            user.disconnectFromChat();
          }
          return this;
        }

        send(from: User, message: string) {
          for (const user of this.users.values()) {
            if (user === from) continue;

            user.notify('message', {
              user: from,
              message
            });
          }
        }
      }
      class User {
        private chat: Chat | null = null;

        constructor(private name: string) { }

        getName() {
          return this.name;
        }
        connectToChat(chat: Chat) {
          if (this.chat) return;
          this.chat = chat;
          this.chat.addUser(this);
        }
        disconnectFromChat() {
          if (!this.chat) return;
          const chat = this.chat;
          this.chat = null;
          chat.kickUser(this);
        }
        sendMessage(message: string) {
          if (!this.chat) return;
          this.chat.send(this, message);
        }
        notify<T extends keyof UserEvents>(event: T, data: UserEvents[T]) {
          switch (event) {
            case 'message': {
              console.log(`[${this.name}] the message "${data.message}" from "${data.user.getName()}" has been received`);
              break;
            }
          }
        }
      }

      export function test() {
        const user1 = new User('Vasia');
        const user2 = new User('LIQ');
        const user3 = new User('Dima');
        const chat = new Chat();

        chat
          .addUser(user1)
          .addUser(user2);
        user3.connectToChat(chat);
        user2.sendMessage('Hi! How are you?');
        user1.disconnectFromChat();
        user2.sendMessage('Vasia is leave?');
      }
    }
    export namespace Memento {
      class EditorSnapshot {
        constructor(private content: string) { }

        getContent() {
          return this.content;
        }
      }
      class Editor {
        constructor(private content = '') { }

        getSnapshot() {
          return new EditorSnapshot(this.content);
        }
        setSnapshot(snapshot?: EditorSnapshot) {
          if (!snapshot) return;
          this.content = snapshot.getContent();
        }
        getContent() {
          return this.content;
        }
        setContent(content: string) {
          this.content = content;
        }
      }
      class EditorHistory {
        private stackSnapshots: EditorSnapshot[] = [];

        push(snapshot: EditorSnapshot) {
          this.stackSnapshots.push(snapshot);
        }
        pop() {
          return this.stackSnapshots.pop();
        }
      }

      export function test() {
        const editor = new Editor();
        const editorHistory = new EditorHistory();

        editor.setContent('first content');
        editorHistory.push(editor.getSnapshot());
        console.log(editor.getContent());

        editor.setContent('edited content');
        editorHistory.push(editor.getSnapshot());
        console.log(editor.getContent());

        editor.setContent('again edited content');
        editorHistory.push(editor.getSnapshot());
        console.log(editor.getContent());

        editor.setSnapshot(editorHistory.pop());
        console.log('Undo:', editor.getContent());

        editor.setSnapshot(editorHistory.pop());
        console.log('Undo:', editor.getContent());

        editor.setSnapshot(editorHistory.pop());
        console.log('Undo:', editor.getContent());
      }
    }
    export namespace Observer {
      abstract class ResizeSubscriber {
        onResize() {
          console.log(`Called "onResize" in ${this.constructor.name}`);
        }
      }
      class Button extends ResizeSubscriber { }
      class Input extends ResizeSubscriber { }
      class Checkbox extends ResizeSubscriber { }
      class ResizeObserver {
        private subscribers = new Set<ResizeSubscriber>();

        subscribe(subscriber: ResizeSubscriber) {
          this.subscribers.add(subscriber);
          return this;
        }
        unsubscribe(subscriber: ResizeSubscriber) {
          this.subscribers.delete(subscriber);
          return this;
        }
        notify() {
          this.subscribers.forEach(subscriber => subscriber.onResize());
        }
      }

      export function test() {
        const resizeObserver = new ResizeObserver();

        resizeObserver
          .subscribe(new Button())
          .subscribe(new Input())
          .subscribe(new Checkbox());
        resizeObserver.notify();
      }
    }
    export namespace State {
      class Light {
        private state = new LightOffState(this);

        setState(state: LightState) {
          this.state = state;
        }
        press() {
          this.state.press();
        }
      }
      abstract class LightState {
        constructor(protected light: Light) { }

        abstract press(): void;
      }
      class LightOnState extends LightState {
        press() {
          console.log('Light turn off');
          this.light.setState(new LightOffState(this.light));
        }
      }
      class LightOffState extends LightState {
        press() {
          console.log('Light turn on');
          this.light.setState(new LightOnState(this.light));
        }
      }

      export function test() {
        const light = new Light();

        light.press();
        light.press();
        light.press();
        light.press();
      }
    }
    export namespace Strategy {
      interface SortStrategy {
        sort(items: number[]): number[];
      }

      class FastSort implements SortStrategy {
        sort(items: number[]) {
          return items.sort();
        }
      }
      class BubbleSort implements SortStrategy {
        sort(items: number[]) {
          return items.sort();
        }
      }
      class InsertionSort implements SortStrategy {
        sort(items: number[]) {
          return items.sort();
        }
      }

      class Sorter {
        constructor(private strategy: SortStrategy) { }

        setStrategy(strategy: SortStrategy) {
          this.strategy = strategy;
        }
        sort(items: number[]) {
          return this.strategy.sort(items);
        }
      }

      export function test() {
        const fastSort = new FastSort();
        const insertionSort = new InsertionSort();
        const bubbleSort = new BubbleSort();
        const sorter = new Sorter(fastSort);

        const numbers = [1, 5, 2, 4, 3];

        if (numbers.length > 10) {
          sorter.setStrategy(fastSort);
          console.log('Fast sort:', sorter.sort(numbers));
        } else if (numbers.length > 5) {
          sorter.setStrategy(insertionSort);
          console.log('Insertion sort sort:', sorter.sort(numbers));
        } else {
          sorter.setStrategy(bubbleSort);
          console.log('Bubble sort:', sorter.sort(numbers));
        }
      }
    }
    export namespace TemplateMethod {
      class CoffeeMachine {
        make() {
          this.boilWater();
          this.pourInCup();
          this.addCoffee();
          this.addSupplement();
        }

        protected boilWater() {
          console.log('Boil the water to 100°C');
        }
        protected pourInCup() {
          console.log('Pour out 300 milligrams');
        }
        protected addCoffee() {
          console.log('Added 1 spoonful of coffee');
        }
        protected addSupplement() {
          console.log('Added 1 cube of sugar');
        }
      }

      class CappuccinoCoffee extends CoffeeMachine {
        protected addCoffee() {
          console.log('Added 0.5 spoonful of coffee');
        }
        protected addSupplement() {
          super.addSupplement();
          console.log('Added 100 milligrams of milk');
        }
      }
      class LatteCoffee extends CoffeeMachine {
        protected pourInCup() {
          console.log('Pour out 200 milligrams');
        }
        protected addSupplement() {
          super.addSupplement();
          console.log('Added 200 grams of milk');
        }
      }

      export function test() {
        const cappuccinoCoffee = new CappuccinoCoffee();
        const latteCoffee = new LatteCoffee();

        cappuccinoCoffee.make();
        latteCoffee.make();
      }
    }
    export namespace Visitor {
      interface Shape {
        accept(visitor: Visitor): void;
      }
      interface Visitor {
        visitRect(rect: Rect): void;
        visitCircle(circle: Circle): void;
      }

      class Rect implements Shape {
        constructor(public w: number, public h: number) { }

        accept(visitor: Visitor) {
          visitor.visitRect(this);
        }
      }
      class Circle implements Shape {
        constructor(public radius: number) { }

        accept(visitor: Visitor) {
          visitor.visitCircle(this);
        }
      }

      class RenderVisitor implements Visitor {
        visitRect(rect: Rect) {
          console.log('Rendered rect:', rect);
        }
        visitCircle(circle: Circle) {
          console.log('Rendered circle:', circle);
        }
      }
      class ExportVisitor implements Visitor {
        visitRect(rect: Rect) {
          console.log('Exported rect:', rect);
        }
        visitCircle(circle: Circle) {
          console.log('Exported circle:', circle);
        }
      }

      export function test() {
        const shapes: Shape[] = [
          new Rect(10, 50),
          new Rect(50, 50),
          new Circle(7),
          new Rect(123, 32)
        ];

        const renderVisitor = new RenderVisitor();
        const exportVisitor = new ExportVisitor();

        shapes.forEach(shape => shape.accept(renderVisitor));
        shapes.forEach(shape => shape.accept(exportVisitor));
      }
    }
  }

  function tryHandler(func: (...args: any) => any) {
    try {
      func();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error('Unknown error');
      }
    }
  }
  function createSpeedTest() {
    const start = Date.now();
    console.log('SpeedTest running...');

    return function () {
      const seconds = (Date.now() - start) / 1000;
      console.log(`SpeedTest result: ${parseFloat(seconds.toFixed(3))}sec`);
    }
  }
}


// GOFPatterns.Creational.FactoryMethod.test();
// GOFPatterns.Creational.AbstractFactory.test();
// GOFPatterns.Creational.Builder.test();
// GOFPatterns.Creational.Prototype.test();
// GOFPatterns.Creational.Singleton.test();

// GOFPatterns.Structural.Adapter.test();
// GOFPatterns.Structural.Bridge.test();
// GOFPatterns.Structural.Composite.test();
// GOFPatterns.Structural.Decorator.test();
// GOFPatterns.Structural.Facade.test();
// GOFPatterns.Structural.Flyweight.test();
// GOFPatterns.Structural.Proxy.test();

// GOFPatterns.Behavioral.ChainOfResponsibility.test();
// GOFPatterns.Behavioral.Command.test();
// GOFPatterns.Behavioral.Interpreter.test();
// GOFPatterns.Behavioral.Iterator.test();
// GOFPatterns.Behavioral.Mediator.test();
// GOFPatterns.Behavioral.Memento.test();
// GOFPatterns.Behavioral.Observer.test();
// GOFPatterns.Behavioral.State.test();
// GOFPatterns.Behavioral.Strategy.test();
// GOFPatterns.Behavioral.TemplateMethod.test();
// GOFPatterns.Behavioral.Visitor.test();
