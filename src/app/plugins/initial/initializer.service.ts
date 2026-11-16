import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { UserRepository, UserSecurityRepository, CurrencyRepository, CategoryRepository, UseRequestContext } from '@database';
import { CategoryTypeENUM, UserStatusENUM } from '@enums';
import { MikroORM } from '@mikro-orm/postgresql';

interface InitialCategory {
  key: string;
  value: string;
  description?: string;
  children?: InitialCategory[];
}

@Injectable()
export class InitializerService {
  private readonly logger: LoggerService;

  constructor(
    private readonly orm: MikroORM,
    private readonly userRepository: UserRepository,
    private readonly userSecurityRepository: UserSecurityRepository,
    private readonly currencyRepository: CurrencyRepository,
    private readonly categoryRepository: CategoryRepository,
    logger: LoggerService,
  ) {
    this.logger = logger.child(InitializerService.name);
  }

  @UseRequestContext()
  async start(): Promise<void> {
    this.logger.log('Starting initialization process...');

    try {
      await this.seedUsers();
      await this.seedCurrencies();
      await this.seedCategories();

      this.logger.log('Initialization completed successfully.');
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async seedUsers(): Promise<void> {
    this.logger.log('Seeding initial users...');

    const defaultPhoneNumber = '+989102233445';
    const existingUser = await this.userRepository.findOne({ phoneNumber: defaultPhoneNumber });

    if (existingUser) {
      this.logger.log(`Default user with phone "${defaultPhoneNumber}" already exists. Skipping.`);
      return;
    }

    const user = this.userRepository.create({
      phoneNumber: defaultPhoneNumber,
      phoneVerifiedAt: new Date(),
      status: UserStatusENUM.ACTIVE,
      statusReason: 'Initial Seed User',
      isDeleted: 0,
    });

    const userSecurity = this.userSecurityRepository.create({
      user,
      passwordHash: '123456',
      twoFactorEnabled: 0,
      isDeleted: 0,
    });

    this.orm.em.persist([user, userSecurity]);
    await this.orm.em.flush();

    this.logger.log(`Default user created successfully with ID: ${user.id}`);
  }

  private async seedCurrencies(): Promise<void> {
    this.logger.log('Seeding initial currencies...');

    const currencies = [
      {
        title: 'تومان ایران',
        code: 'IRT',
        symbol: 'تومان',
        decimalPlaces: 0,
        description: 'واحد متداول پول در معاملات روزمره ایران',
      },
      {
        title: 'USA - UnitedState',
        code: 'USD',
        symbol: '$',
        decimalPlaces: 2,
        description: 'دلار ایالات متحده آمریکا',
      },
    ];

    let insertedCount = 0;
    for (const currencyData of currencies) {
      const exists = await this.currencyRepository.findOne({ code: currencyData.code });
      if (!exists) {
        const currency = this.currencyRepository.create({ ...currencyData, isDeleted: 0 });
        this.orm.em.persist(currency);
        insertedCount++;
      }
    }

    if (insertedCount > 0) {
      await this.orm.em.flush();
      this.logger.log(`${insertedCount} currencies seeded successfully.`);
    } else {
      this.logger.log('All currencies already exist. Skipping.');
    }
  }

  private async seedCategories(): Promise<void> {
    this.logger.log('Seeding initial categories...');

    const categoryTree: { income: InitialCategory[]; expenses: InitialCategory[] } = {
      income: [
        {
          key: 'SALARY',
          value: 'حقوق و دستمزد',
          description: 'حقوق ماهانه، دستمزد و اضافه‌کاری',
        },
        {
          key: 'FREELANCE',
          value: 'فریلنسری',
          description: 'درآمد فریلنسری، مشاوره و پروژه‌های جانبی',
        },
        {
          key: 'BUSINESS',
          value: 'درآمد کسب‌وکار',
          description: 'درآمد حاصل از فروش کالا و ارائه خدمات',
        },
        {
          key: 'INVESTMENT_INCOME',
          value: 'عایدی سرمایه‌گذاری',
          description: 'سود سهام، صندوق‌ها و معاملات سرمایه‌گذاری',
        },
        {
          key: 'RENTAL',
          value: 'درآمد اجاره',
          description: 'اجاره ملک، خودرو یا تجهیزات',
        },
        {
          key: 'GIFT',
          value: 'هدیه دریافتی',
          description: 'پول یا مبلغی که به‌صورت هدیه دریافت می‌کنی و نیازی به بازپرداخت آن نداری',
        },
        {
          key: 'BORROWED_MONEY',
          value: 'پول قرضی',
          description: 'پولی که دریافت می‌کنی و متعهد به بازپرداخت آن هستی',
        },
        {
          key: 'GOVERNMENT_BENEFIT',
          value: 'یارانه و حمایت دولتی',
          description: 'یارانه، کمک‌هزینه و مستمری',
        },
        {
          key: 'ASSET_SALE',
          value: 'فروش دارایی',
          description: 'فروش خودرو، موبایل، طلا و سایر دارایی‌ها',
        },
        {
          key: 'OTHER_INCOME',
          value: 'سایر درآمدها',
          description: 'درآمدهای غیرقابل طبقه‌بندی در دسته‌های دیگر',
        },
        {
          key: 'LOAN_RECEIVED',
          value: 'دریافت وام',
          description: 'ایجاد بدهی از طریق دریافت تسهیلات',
        },
      ],
      expenses: [
        {
          // FOOD
          key: 'FOOD',
          value: 'خوراک و مواد غذایی',
          description: 'هزینه خرید مواد غذایی، وعده‌های غذایی و نوشیدنی',
          children: [
            {
              key: 'GROCERIES',
              value: 'خرید مواد غذایی و خواربار',
              description: 'خرید اقلام روزمره غذایی و خواربار',
            },
            {
              key: 'FRUITS_VEGETABLES',
              value: 'میوه و سبزیجات',
              description: 'خرید میوه، سبزی و صیفی‌جات',
            },
            {
              key: 'MEAT_DAIRY',
              value: 'گوشت، مرغ، ماهی و لبنیات',
              description: 'خرید انواع گوشت، پروتئین و لبنیات',
            },
            {
              key: 'BAKERY',
              value: 'نان و شیرینی',
              description: 'خرید نان، شیرینی و محصولات نانوایی',
            },
            {
              key: 'RESTAURANT',
              value: 'رستوران و فست‌فود',
              description: 'غذا خوردن در رستوران و فست‌فود یا سفارش غذا',
            },
            {
              key: 'CAFE',
              value: 'کافه و نوشیدنی',
              description: 'کافه، قهوه، آبمیوه و نوشیدنی',
            },
          ],
        },
        {
          // HOUSING
          key: 'HOUSING',
          value: 'مسکن و زندگی',
          description: 'هزینه‌های محل سکونت و نگهداری خانه',
          children: [
            {
              key: 'RENT',
              value: 'اجاره مسکن',
              description: 'اجاره‌بهای محل سکونت',
            },
            {
              key: 'UTILITIES',
              value: 'آب، برق، گاز و فاضلاب',
              description: 'قبوض خدمات شهری و مصرفی',
            },
            {
              key: 'COMMUNICATION',
              value: 'تلفن ثابت و هزینه‌های مرتبط با خانه',
              description: 'هزینه تلفن ثابت و خدمات ارتباطی منزل',
            },
            {
              key: 'BUILDING_CHARGES',
              value: 'شارژ ساختمان',
              description: 'شارژ ماهانه و هزینه‌های مشترک ساختمان',
            },
            {
              key: 'HOME_MAINTENANCE',
              value: 'تعمیرات و نگهداری خانه',
              description: 'تعمیرات و خدمات فنی منزل',
            },
            {
              key: 'FURNITURE_APPLIANCES',
              value: 'مبلمان و لوازم خانگی',
              description: 'خرید یا تعمیر مبلمان و لوازم خانگی',
            },
          ],
        },
        {
          // TRANSPORTATION
          key: 'TRANSPORTATION',
          value: 'حمل‌ونقل و وسایل نقلیه',
          description: 'هزینه رفت‌وآمد و نگهداری وسایل نقلیه',
          children: [
            {
              key: 'FUEL',
              value: 'بنزین و سوخت',
              description: 'هزینه سوخت خودرو و موتورسیکلت',
            },
            {
              key: 'PUBLIC_TRANSIT',
              value: 'مترو، اتوبوس و تاکسی',
              description: 'هزینه حمل‌ونقل عمومی',
            },
            {
              key: 'VEHICLE_MAINTENANCE',
              value: 'تعمیرات و سرویس وسیله نقلیه',
              description: 'تعمیر، سرویس، روغن و قطعات',
            },
            {
              key: 'VEHICLE_INSURANCE',
              value: 'بیمه خودرو و موتورسیکلت',
              description: 'بیمه شخص ثالث و بدنه',
            },
            {
              key: 'PARKING_TOLLS',
              value: 'پارکینگ و عوارض',
              description: 'هزینه پارکینگ و عوارض جاده‌ای',
            },
            {
              key: 'VEHICLE_EXPENSES',
              value: 'هزینه‌های قانونی وسیله نقلیه',
              description: 'معاینه فنی، خلافی و عوارض سالانه',
            },
          ],
        },
        {
          // HEALTH
          key: 'HEALTH',
          value: 'سلامت و مراقبت شخصی',
          description: 'هزینه‌های درمان، پزشکی و مراقبت فردی',
          children: [
            {
              key: 'MEDICATION',
              value: 'دارو و داروخانه',
              description: 'دارو، مکمل و اقلام دارویی',
            },
            {
              key: 'DOCTOR',
              value: 'پزشک و ویزیت',
              description: 'مراجعه به پزشک و درمانگاه',
            },
            {
              key: 'DENTAL',
              value: 'دندانپزشکی',
              description: 'خدمات و درمان‌های دندانپزشکی',
            },
            {
              key: 'MEDICAL_TESTS',
              value: 'آزمایش و تصویربرداری',
              description: 'آزمایشگاه و خدمات تصویربرداری پزشکی',
            },
            {
              key: 'HOSPITAL',
              value: 'بیمارستان و بستری',
              description: 'هزینه بستری، جراحی و خدمات بیمارستانی',
            },
            {
              key: 'HEALTH_INSURANCE',
              value: 'بیمه درمان',
              description: 'حق بیمه درمان پایه یا تکمیلی',
            },
            {
              key: 'PERSONAL_CARE',
              value: 'بهداشت و مراقبت شخصی',
              description: 'محصولات بهداشتی و مراقبت پوست و مو',
            },
          ],
        },
        {
          // CLOTHING
          key: 'CLOTHING',
          value: 'پوشاک و ظاهر',
          description: 'هزینه پوشاک، پیرایش و زیبایی',
          children: [
            {
              key: 'CLOTHES',
              value: 'لباس',
              description: 'خرید انواع پوشاک',
            },
            {
              key: 'SHOES_BAGS',
              value: 'کیف و کفش',
              description: 'خرید کیف و انواع کفش',
            },
            {
              key: 'ACCESSORIES',
              value: 'ساعت، عینک و اکسسوری',
              description: 'خرید لوازم و اکسسوری شخصی',
            },
            {
              key: 'BARBER_BEAUTY',
              value: 'آرایشگاه و زیبایی',
              description: 'اصلاح، آرایش و خدمات زیبایی',
            },
            {
              key: 'TAILOR_LAUNDRY',
              value: 'خیاطی و خشکشویی',
              description: 'دوخت، تعمیر، شستشو و اتوکشی لباس',
            },
          ],
        },
        {
          // EDUCATION
          key: 'EDUCATION',
          value: 'آموزش و توسعه فردی',
          description: 'هزینه تحصیل، یادگیری و ارتقای مهارت',
          children: [
            {
              key: 'TUITION',
              value: 'شهریه و تحصیلات',
              description: 'شهریه مدرسه، دانشگاه و مراکز آموزشی',
            },
            {
              key: 'COURSES',
              value: 'دوره و کلاس آموزشی',
              description: 'دوره‌ها، کارگاه‌ها و کلاس‌های تخصصی',
            },
            {
              key: 'BOOKS',
              value: 'کتاب و منابع آموزشی',
              description: 'کتاب، مجله و منابع یادگیری',
            },
            {
              key: 'EXAMS_CERTIFICATES',
              value: 'آزمون و مدارک تخصصی',
              description: 'هزینه آزمون‌ها و دریافت گواهینامه',
            },
          ],
        },
        {
          // LIFESTYLE
          key: 'LIFESTYLE',
          value: 'تفریح و سبک زندگی',
          description: 'هزینه ورزش، سرگرمی، سفر و فعالیت‌های شخصی',
          children: [
            {
              key: 'SPORTS_GYM',
              value: 'باشگاه و ورزش',
              description: 'شهریه باشگاه، استخر و فعالیت ورزشی',
            },
            {
              key: 'ENTERTAINMENT',
              value: 'سینما، کنسرت و سرگرمی',
              description: 'بلیط و هزینه تفریحات',
            },
            {
              key: 'GAMES_HOBBIES',
              value: 'بازی و سرگرمی‌های شخصی',
              description: 'بازی، گیم و سرگرمی‌های فردی',
            },
            {
              key: 'TRAVEL',
              value: 'سفر، تور و اقامت',
              description: 'هزینه سفر، بلیط، هتل و اقامت',
            },
            {
              key: 'SUBSCRIPTIONS',
              value: 'اشتراک سرویس‌ها',
              description: 'اشتراک سرویس‌های فیلم، موسیقی و خدمات آنلاین',
            },
            {
              key: 'PERSONAL_ACTIVITIES',
              value: 'فعالیت‌ها و تفریحات شخصی',
              description: 'سایر فعالیت‌های تفریحی و شخصی',
            },
          ],
        },
        {
          // TECHNOLOGY
          key: 'TECHNOLOGY',
          value: 'فناوری و ارتباطات',
          description: 'هزینه تجهیزات دیجیتال و خدمات فناوری',
          children: [
            {
              key: 'MOBILE_INTERNET',
              value: 'اینترنت همراه و شارژ',
              description: 'بسته اینترنت و شارژ سیم‌کارت',
            },
            {
              key: 'HOME_INTERNET',
              value: 'اینترنت ثابت',
              description: 'اشتراک اینترنت خانگی',
            },
            {
              key: 'DIGITAL_DEVICES',
              value: 'موبایل، لپ‌تاپ و تجهیزات',
              description: 'خرید و تعمیر تجهیزات دیجیتال',
            },
            {
              key: 'SERVICES',
              value: 'VPN - AI - Software',
              description: 'خرید نرم‌افزار و مجوز استفاده',
            },
            {
              key: 'HOSTING_SERVICES',
              value: 'هاست، دامنه و سرور',
              description: 'هزینه زیرساخت و خدمات میزبانی',
            },
          ],
        },
        {
          // FAMILY
          key: 'FAMILY',
          value: 'خانواده و روابط اجتماعی',
          description: 'هزینه‌های خانواده، مناسبت‌ها و کمک‌های اجتماعی',
          children: [
            {
              key: 'CHILDREN',
              value: 'فرزندان',
              description: 'هزینه‌های نگهداری و نیازهای فرزندان',
            },
            {
              key: 'FAMILY_SUPPORT',
              value: 'کمک مالی به خانواده',
              description: 'مبالغ پرداختی برای حمایت از اعضای خانواده',
            },
            {
              key: 'EXPENSESS_GIFTS',
              value: 'هدیه و کادو',
              description: 'خرید هدیه برای دیگران',
            },
            {
              key: 'CHARITY',
              value: 'خیریه و کمک به نیازمندان',
              description: 'کمک‌های خیریه و نذورات',
            },
            {
              key: 'PETS',
              value: 'حیوانات خانگی',
              description: 'غذا، لوازم و دامپزشکی حیوانات',
            },
          ],
        },
        {
          key: 'FINANCIAL',
          value: 'هزینه‌های مالی و قانونی',
          description: 'هزینه خدمات مالی، بانکی و قانونی',
          children: [
            {
              key: 'BANK_FEES',
              value: 'کارمزد بانکی',
              description: 'کارمزد انتقال وجه و خدمات بانکی',
            },
            {
              key: 'TAXES',
              value: 'مالیات',
              description: 'مالیات‌های شخصی و قانونی',
            },
            {
              key: 'FINES',
              value: 'جریمه و دیرکرد',
              description: 'جریمه‌ها و هزینه دیرکرد',
            },
            {
              key: 'LEGAL_SERVICES',
              value: 'خدمات حقوقی و اداری',
              description: 'هزینه مشاوره حقوقی و خدمات اداری',
            },
            {
              key: 'INSURANCE',
              value: 'سایر بیمه‌ها',
              description: 'بیمه‌هایی غیر از بیمه درمان و وسیله نقلیه',
            },
            {
              key: 'TRANSFER',
              value: 'انتقال بین حساب‌ها',
              description: 'جابجایی پول بین حساب‌های متعلق به خود',
            },
            {
              key: 'INVESTMENT',
              value: 'سرمایه‌گذاری',
              description: 'تبدیل پول به دارایی یا ابزار سرمایه‌گذاری',
            },
            {
              key: 'INSTALLMENTS',
              value: 'اقساط',
              description: 'پرداخت قسط',
            },
            {
              key: 'REFUND',
              value: 'برگشت وجه',
              description: 'بازگشت وجه خرید یا اصلاح تراکنش قبلی',
            },
            {
              key: 'LENDING',
              value: 'قرض دادن',
              description: 'پرداخت پول به دیگران با انتظار بازپرداخت آن',
            },
            {
              key: 'DEBT_REPAYMENT',
              value: 'پرداخت بدهی',
              description: 'بازپرداخت پول قرض‌گرفته‌شده یا تسویه بدهی به دیگران',
            },
          ],
        },
        {
          key: 'OTHER',
          value: 'سایر هزینه‌ها',
          description: 'هزینه‌های اضطراری یا هنوز دسته‌بندی‌نشده',
          children: [
            {
              key: 'EMERGENCY',
              value: 'هزینه‌های اضطراری',
              description: 'هزینه‌های ناگهانی و پیش‌بینی‌نشده',
            },
            {
              key: 'UNCLASSIFIED',
              value: 'هزینه‌های دسته‌بندی‌نشده',
              description: 'هزینه‌هایی که هنوز دسته مناسب ندارند',
            },
          ],
        },
      ],
    };

    let parentCount = 0;
    let childCount = 0;

    const seedGroup = async (items: InitialCategory[], type: CategoryTypeENUM) => {
      for (const parentData of items) {
        let parent = await this.categoryRepository.findOne({ key: parentData.key, parent: null });

        if (!parent) {
          parent = this.categoryRepository.create({
            key: parentData.key,
            value: parentData.value,
            description: parentData.description,
            type,
            isDeleted: 0,
          });
          this.orm.em.persist(parent);
          await this.orm.em.flush();
          parentCount++;
        } else if (parent.type !== type) {
          parent.type = type;
          this.orm.em.persist(parent);
        }

        if (parentData.children && parentData.children.length > 0) {
          for (const childData of parentData.children) {
            const childExists = await this.categoryRepository.findOne({
              key: childData.key,
              parent: parent.id,
            });

            if (!childExists) {
              const child = this.categoryRepository.create({
                key: childData.key,
                value: childData.value,
                description: childData.description,
                type,
                parent,
                isDeleted: 0,
              });
              this.orm.em.persist(child);
              childCount++;
            } else if (childExists.type !== type) {
              childExists.type = type;
              this.orm.em.persist(childExists);
            }
          }
        }
      }
    };

    await seedGroup(categoryTree.income, CategoryTypeENUM.INCOME);
    await seedGroup(categoryTree.expenses, CategoryTypeENUM.EXPENSE);

    if (childCount > 0 || parentCount > 0) {
      await this.orm.em.flush();
    }

    this.logger.log(`Categories seeding complete. ${parentCount} parent(s) and ${childCount} child category/categories added.`);
  }
}
