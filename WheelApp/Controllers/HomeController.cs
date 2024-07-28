using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WheelApp.Models;
using WheelApp.Models.Employee;

namespace WheelApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IEmployeeService _employeeService;

        public HomeController(ILogger<HomeController> logger, IEmployeeService employeeService)
        {
            _logger = logger;
            _employeeService = employeeService;
        }

        public IActionResult Index()
        {
           var result = _employeeService.GetAllEmployees();
            return View(result);
        }
        [HttpPost("incrementWheelCount/{id}")]
        public IActionResult IncrementWheelCount(int id)
        {
            _employeeService.IncrementWheelCount(id);
            return Ok();
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
