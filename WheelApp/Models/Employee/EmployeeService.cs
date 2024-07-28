namespace WheelApp.Models.Employee
{
    public class EmployeeService : IEmployeeService
    {
        public List<Employee> Employees { get; set; } = new List<Employee>()
            {
                new Employee() { Id = 1, Name = "Mao", Color = "Red", WheelCount = 0, ImagePath = "/images/mao.jpg" },
                new Employee() { Id = 2, Name = "Archil", Color = "Blue", WheelCount = 0, ImagePath = "/images/archil.jpg" },
                new Employee() { Id = 3, Name = "Khostar", Color = "Pink", WheelCount = 0, ImagePath = "/images/khostar.jpg" },
                new Employee() { Id = 4, Name = "Nika Arsena", Color = "Green", WheelCount = 0, ImagePath = "/images/arsena.jpg" },
                new Employee() { Id = 5, Name = "Nika Tabagari", Color = "Gold", WheelCount = 0, ImagePath = "/images/tabagari.jpg" },
                new Employee() { Id = 6, Name = "Nika Kirakosiani", Color = "Purple", WheelCount = 0, ImagePath = "/images/kirakosian.jpg" },
                new Employee() { Id = 7, Name = "Mariam", Color = "Pink", WheelCount = 0, ImagePath = "/images/mariam.jpg" },
                new Employee() { Id = 8, Name = "Zura", Color = "White", WheelCount = 0, ImagePath = "/images/zura.jpg" },
                new Employee() { Id = 9, Name = "Bidzina", Color = "Orange", WheelCount = 0, ImagePath = "/images/bidzina.jpg" },
            };
        public EmployeeService()
        {
        }

        public Employee GetRandomEmployee()
        {
            Random rnd = new Random();
            int r = rnd.Next(Employees.Count);
            return Employees[r];
        }

        public List<Employee> GetAllEmployees()
        {
            return Employees;
        }

        public void DeleteEmployee(int id)
        {
            Employees.RemoveAll(x => x.Id == id);
        }
        public void AddEmployee(Employee employee)
        {
            Employees.Add(employee);
        }

        public void IncrementWheelCount(int id)
        {
            var employee = Employees.FirstOrDefault(e => e.Id == id);
            if (employee != null)
            {
                employee.WheelCount++;
            }
        }
    }
}
