using TirthSeva.API.Models;
using BCrypt.Net;

namespace TirthSeva.API.Data
{
    public static class DbSeeder
    {
        public static void SeedData(ApplicationDbContext context)
        {
            // Always ensure admin exists FIRST
            var adminEmail = "admin@tirthseva.com";
            var existingAdmin = context.Users
                .FirstOrDefault(u => u.Email == adminEmail && u.Role == "Admin");
            
            if (existingAdmin == null)
            {
                var adminUser = new User
                {
                    Name = "Admin User",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                };
                
                context.Users.Add(adminUser);
                context.SaveChanges();
                
                Console.WriteLine("Admin user created: admin@tirthseva.com / Admin@123");
            }
            else
            {
                Console.WriteLine("Admin user already exists");
            }
            
            // Check if other data already exists - if it does, skip the rest of seeding
            if (context.Temples.Any())
            {
                return; // Database has been seeded with sample data
            }

            // Seed the rest of the users (regular user and providers)
            var regularUser = new User
            {
                Name = "Ramesh Kumar",
                Email = "ramesh@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
                Role = "User",
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow
            };

            var provider1 = new User
            {
                Name = "Suresh Sharma",
                Email = "suresh@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Provider@123"),
                Role = "ServiceProvider",
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow
            };

            var provider2 = new User
            {
                Name = "Mahesh Patel",
                Email = "mahesh@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Provider@123"),
                Role = "ServiceProvider",
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.AddRange(regularUser, provider1, provider2);
            context.SaveChanges();

            // Seed 10 Famous Indian Temples - assigned to providers
            var temples = new List<Temple>
            {
                new Temple
                {
                    ServiceProviderId = provider1.Id,
                    Name = "Tirupati Balaji Temple",
                    Location = "Tirumala Hills",
                    City = "Tirupati",
                    State = "Andhra Pradesh",
                    Description = "One of the most visited pilgrimage centers in the world, dedicated to Lord Venkateswara.",
                    ImagePath = null,
                    Latitude = 13.6833,
                    Longitude = 79.3500
                },
                new Temple
                {
                    ServiceProviderId = provider1.Id,
                    Name = "Vaishno Devi Temple",
                    Location = "Trikuta Mountains",
                    City = "Katra",
                    State = "Jammu & Kashmir",
                    Description = "Sacred shrine of Goddess Vaishno Devi, located in the Trikuta Mountains.",
                    ImagePath = null,
                    Latitude = 33.0309,
                    Longitude = 74.9500
                },
                new Temple
                {
                    ServiceProviderId = provider2.Id,
                    Name = "Golden Temple",
                    Location = "Harmandir Sahib",
                    City = "Amritsar",
                    State = "Punjab",
                    Description = "The holiest Gurdwara of Sikhism, known for its golden dome and spiritual sanctity.",
                    ImagePath = null,
                    Latitude = 31.6200,
                    Longitude = 74.8765
                },
                new Temple
                {
                    ServiceProviderId = provider2.Id,
                    Name = "Jagannath Temple",
                    Location = "Grand Road",
                    City = "Puri",
                    State = "Odisha",
                    Description = "Famous for the annual Rath Yatra and dedicated to Lord Jagannath.",
                    ImagePath = null,
                    Latitude = 19.8048,
                    Longitude = 85.8314
                },
                new Temple
                {
                    ServiceProviderId = provider1.Id,
                    Name = "Kashi Vishwanath Temple",
                    Location = "Vishwanath Gali",
                    City = "Varanasi",
                    State = "Uttar Pradesh",
                    Description = "One of the twelve Jyotirlingas dedicated to Lord Shiva.",
                    ImagePath = null,
                    Latitude = 25.3109,
                    Longitude = 83.0107
                },
                new Temple
                {
                    ServiceProviderId = provider1.Id,
                    Name = "Shirdi Sai Baba Temple",
                    Location = "Shirdi Town",
                    City = "Shirdi",
                    State = "Maharashtra",
                    Description = "Dedicated to the revered saint Sai Baba of Shirdi.",
                    ImagePath = null,
                    Latitude = 19.7645,
                    Longitude = 74.4777
                },
                new Temple
                {
                    ServiceProviderId = provider2.Id,
                    Name = "Dwarkadhish Temple",
                    Location = "Dwarka City",
                    City = "Dwarka",
                    State = "Gujarat",
                    Description = "One of the Char Dham pilgrimage sites, dedicated to Lord Krishna.",
                    ImagePath = null,
                    Latitude = 22.2442,
                    Longitude = 68.9685
                },
                new Temple
                {
                    ServiceProviderId = provider2.Id,
                    Name = "Badrinath Temple",
                    Location = "Garhwal Hills",
                    City = "Badrinath",
                    State = "Uttarakhand",
                    Description = "One of the Char Dham and dedicated to Lord Vishnu.",
                    ImagePath = null,
                    Latitude = 30.7433,
                    Longitude = 79.4938
                },
                new Temple
                {
                    ServiceProviderId = provider1.Id,
                    Name = "Kedarnath Temple",
                    Location = "Rudraprayag District",
                    City = "Kedarnath",
                    State = "Uttarakhand",
                    Description = "One of the twelve Jyotirlingas and Char Dham, located in the Himalayas.",
                    ImagePath = null,
                    Latitude = 30.7346,
                    Longitude = 79.0669
                },
                new Temple
                {
                    ServiceProviderId = provider2.Id,
                    Name = "Somnath Temple",
                    Location = "Prabhas Patan",
                    City = "Somnath",
                    State = "Gujarat",
                    Description = "First among the twelve Jyotirlingas, located on the Arabian Sea coast.",
                    ImagePath = null,
                    Latitude = 20.8880,
                    Longitude = 70.4013
                }
            };

            context.Temples.AddRange(temples);
            context.SaveChanges();

            // Seed Bhaktnivas for each temple
            var bhaktnivasList = new List<Bhaktnivas>();
            int bhaktnivasIndex = 0;
            foreach (var temple in temples)
            {
                var provider = bhaktnivasIndex % 2 == 0 ? provider1 : provider2;
                
                bhaktnivasList.AddRange(new[]
                {
                    new Bhaktnivas
                    {
                        TempleId = temple.Id,
                        ServiceProviderId = provider.Id,
                        Name = $"Shanti Niwas - {temple.City}",
                        Description = "Clean and comfortable accommodation for devotees with basic amenities.",
                        PricePerNight = 80,
                        Capacity = 4,
                        IsAvailable = true,
                        DistanceFromTemple = "500m",
                        ImageUrl = "/images/bhaktnivas/default1.jpg"
                    },
                    new Bhaktnivas
                    {
                        TempleId = temple.Id,
                        ServiceProviderId = provider.Id,
                        Name = $"Dharamshala {temple.City}",
                        Description = "Budget-friendly stay for pilgrims with shared facilities.",
                        PricePerNight = 50,
                        Capacity = 6,
                        IsAvailable = true,
                        DistanceFromTemple = "800m",
                        ImageUrl = "/images/bhaktnivas/default2.jpg"
                    },
                    new Bhaktnivas
                    {
                        TempleId = temple.Id,
                        ServiceProviderId = provider.Id,
                        Name = $"Ananda Niwas - {temple.City}",
                        Description = "Peaceful accommodation near the temple with modern facilities.",
                        PricePerNight = 150,
                        Capacity = 3,
                        IsAvailable = true,
                        DistanceFromTemple = "300m",
                        ImageUrl = "/images/bhaktnivas/default3.jpg"
                    }
                });
                bhaktnivasIndex++;
            }

            context.Bhaktnivas.AddRange(bhaktnivasList);
            context.SaveChanges();

            // Seed Darshan Slots (next 7 days)
            var darshanSlots = new List<DarshanSlot>();
            foreach (var temple in temples)
            {
                for (int day = 0; day < 7; day++)
                {
                    var date = DateTime.Today.AddDays(day);
                    
                    darshanSlots.AddRange(new[]
                    {
                        new DarshanSlot
                        {
                            TempleId = temple.Id,
                            Date = date,
                            StartTime = new TimeSpan(6, 0, 0),
                            EndTime = new TimeSpan(9, 0, 0),
                            Capacity = 100,
                            AvailableSlots = 100
                        },
                        new DarshanSlot
                        {
                            TempleId = temple.Id,
                            Date = date,
                            StartTime = new TimeSpan(9, 0, 0),
                            EndTime = new TimeSpan(12, 0, 0),
                            Capacity = 150,
                            AvailableSlots = 150
                        },
                        new DarshanSlot
                        {
                            TempleId = temple.Id,
                            Date = date,
                            StartTime = new TimeSpan(16, 0, 0),
                            EndTime = new TimeSpan(19, 0, 0),
                            Capacity = 120,
                            AvailableSlots = 120
                        }
                    });
                }
            }

            context.DarshanSlots.AddRange(darshanSlots);
            context.SaveChanges();

            // Seed Food Services
            var foodServices = new List<FoodService>();
            foreach (var temple in temples)
            {
                foodServices.AddRange(new[]
                {
                    new FoodService
                    {
                        TempleId = temple.Id,
                        Name = $"Temple Prasadam - {temple.City}",
                        Type = "Prasadam",
                        Timing = "6:00 AM - 8:00 PM",
                        Distance = "Inside Temple Complex",
                        AveragePrice = 20,
                        Description = "Sacred food offered to devotees free or at minimal cost."
                    },
                    new FoodService
                    {
                        TempleId = temple.Id,
                        Name = $"Annapurna Bhojan - {temple.City}",
                        Type = "Food",
                        Timing = "7:00 AM - 9:00 PM",
                        Distance = "200m",
                        AveragePrice = 50,
                        Description = "Affordable vegetarian meals for pilgrims."
                    },
                    new FoodService
                    {
                        TempleId = temple.Id,
                        Name = $"Satvik Cafe - {temple.City}",
                        Type = "Food",
                        Timing = "8:00 AM - 8:00 PM",
                        Distance = "400m",
                        AveragePrice = 80,
                        Description = "Pure vegetarian restaurant with North and South Indian cuisine."
                    },
                    new FoodService
                    {
                        TempleId = temple.Id,
                        Name = $"Temple Souvenir Shop - {temple.City}",
                        Type = "Shop",
                        Timing = "6:00 AM - 9:00 PM",
                        Distance = "100m",
                        AveragePrice = 100,
                        Description = "Religious items, books, and souvenirs for devotees."
                    }
                });
            }

            context.FoodServices.AddRange(foodServices);
            context.SaveChanges();
            
            Console.WriteLine("Sample data seeded successfully!");
        }
    }
}