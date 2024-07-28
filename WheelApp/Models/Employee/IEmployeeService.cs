
namespace WheelApp.Models.Employee
{
    public interface IEmployeeService
    {
        List<Employee> Employees { get; set; }

        void AddEmployee(Employee employee);
        void DeleteEmployee(int id);
        List<Employee> GetAllEmployees();
        Employee GetRandomEmployee();
        void IncrementWheelCount(int id);
    }
}